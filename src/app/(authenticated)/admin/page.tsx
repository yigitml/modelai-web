"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";

type EntityType = "user" | "model" | "photo" | "video" | "file" | "subscription" | "userCredit" | "training" | "photoPrediction" | "videoPrediction" | "userSession" | "userDevice";

export default function AdminPage() {
  const [selectedEntity, setSelectedEntity] = useState<EntityType>("user");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterProperty, setFilterProperty] = useState<string>("");
  const [filterValue, setFilterValue] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  useEffect(() => {
    checkAuthorization();
  }, []);

  useEffect(() => {
    if (!loading) {
      fetchData();
    }
  }, [selectedEntity]);

  const checkAuthorization = async () => {
    try {
      const response = await fetch('/api/user', {
        headers: getDefaultHeaders(),
        credentials: "include"
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      
      const userData = await response.json();
      console.log('User response:', userData.data);
      
      if (userData.data.email !== 'ch3xinthehood@gmail.com') {
        window.location.href = '/unauthorized';
        return;
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Authorization check failed:', error);
      window.location.href = '/unauthorized';
    }
  };

  const getDefaultHeaders = () => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "Accept": "application/json"
    };

    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    return headers;
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/${selectedEntity}`, {
        headers: getDefaultHeaders(),
        credentials: "include"
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      if (!result.data) {
        throw new Error('Data is missing from response');
      }
      setData(result.data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error(`Error fetching ${selectedEntity}:`, error);
      setError(`Failed to load ${selectedEntity}: ${errorMessage}`);
      setData([]);
    }
    setLoading(false);
  };

  const handleEdit = async (item: any) => {
    setEditingItem(item);
    setEditDialogOpen(true);
  };

  const handleSave = async (id: string, updatedData: any) => {
    try {
      const response = await fetch(`/api/admin/${selectedEntity}/${id}`, {
        method: "PUT",
        headers: getDefaultHeaders(),
        credentials: "include",
        body: JSON.stringify(updatedData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      setEditingItem(null);
      setEditDialogOpen(false);
      await fetchData();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error(`Error updating ${selectedEntity}:`, error);
      setError(`Failed to update ${selectedEntity}: ${errorMessage}`);
    }
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setEditDialogOpen(false);
  };

  const getAvailableProperties = () => {
    if (data.length === 0) return [];
    return Object.keys(data[0]).filter(key => 
      typeof data[0][key] !== 'object' && 
      !Array.isArray(data[0][key])
    );
  };

  const renderTableCell = (item: any, key: string, value: any) => {
    if (editingItem?.id === item.id) {
      if (key === "id" || key.includes("At")) {
        return <TableCell key={key}>{value}</TableCell>;
      }
      
      return (
        <TableCell key={key}>
          <Input
            defaultValue={value}
            onChange={(e) => {
              setEditingItem({
                ...editingItem,
                [key]: e.target.value
              });
            }}
          />
        </TableCell>
      );
    }

    return (
      <TableCell key={key}>
        {key.includes("At") && typeof value === "string"
          ? format(new Date(value), "PPpp")
          : String(value)}
      </TableCell>
    );
  };

  const renderTable = () => {
    if (loading) {
      return <div className="text-center py-4">Loading...</div>;
    }

    if (error) {
      return <div className="text-center py-4 text-red-500">{error}</div>;
    }

    if (!data.length) {
      return <div className="text-center py-4">No data available</div>;
    }

    const filteredData = data.filter((item) => {
      const matchesSearch = Object.values(item).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      );

      const matchesFilter = filterProperty === "_none" || !filterProperty || !filterValue || 
        String(item[filterProperty])?.toLowerCase().includes(filterValue.toLowerCase());

      return matchesSearch && matchesFilter;
    });

    const columnCount = Object.keys(filteredData[0]).length + 1;
    const columnWidth = `${100 / columnCount}%`;

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px] px-2">
              Actions
            </TableHead>
            {data.length > 0 &&
              Object.keys(data[0]).map((key) => (
                <TableHead 
                  key={key} 
                  style={{ width: columnWidth }}
                  className="px-2 whitespace-normal break-words"
                >
                  {key}
                </TableHead>
              ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="w-[60px] px-2">
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(item)}
                    className="h-8 w-8"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setItemToDelete(item.id);
                      setDeleteDialogOpen(true);
                    }}
                    className="h-8 w-8 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
              {Object.entries(item).map(([key, value]) => (
                <TableCell 
                  key={key}
                  style={{ width: columnWidth }}
                  className="px-2 truncate"
                >
                  <div className="max-w-full overflow-hidden text-ellipsis">
                    {key.includes("At") && typeof value === "string"
                      ? format(new Date(value), "PPpp")
                      : String(value)}
                  </div>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/${selectedEntity}/${id}`, {
        method: "DELETE",
        headers: getDefaultHeaders(),
        credentials: "include"
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setDeleteDialogOpen(false);
      setItemToDelete(null);
      await fetchData();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error(`Error deleting ${selectedEntity}:`, error);
      setError(`Failed to delete ${selectedEntity}: ${errorMessage}`);
    }
  };

  return (
    <AuthenticatedLayout>
      <div>
      <div>
        <div className="container mx-auto p-6">
          <Card>
            <CardHeader>
              <CardTitle>Admin Panel</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="p-4">
                <div className="flex flex-col gap-4 mb-4">
                  <div className="flex flex-wrap gap-2">
                    {[
                      "user",
                      "model",
                      "photo",
                      "video",
                      "file",
                      "subscription",
                      "userCredit",
                      "training",
                      "photoPrediction",
                      "videoPrediction",
                      "userSession",
                      "userDevice",
                    ].map((entity) => (
                      <Button
                        key={entity}
                        variant={selectedEntity === entity ? "default" : "outline"}
                        onClick={() => setSelectedEntity(entity as EntityType)}
                        className="capitalize"
                      >
                        {entity.replace(/([A-Z])/g, ' $1').trim()}
                      </Button>
                    ))}
                  </div>

                  <Input
                    placeholder="Search all fields..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />

                  <div className="flex gap-2">
                    <Select
                      value={filterProperty}
                      onValueChange={setFilterProperty}
                    >
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Filter by property" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="_none">None</SelectItem>
                        {getAvailableProperties().map((prop) => (
                          <SelectItem key={prop} value={prop}>
                            {prop}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {filterProperty && filterProperty !== "_none" && (
                      <Input
                        placeholder={`Filter by ${filterProperty}...`}
                        value={filterValue}
                        onChange={(e) => setFilterValue(e.target.value)}
                        className="flex-1"
                      />
                    )}
                  </div>
                </div>
                
                <div className="w-full">
                  {renderTable()}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="bg-gray-900 border border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Edit {selectedEntity}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {editingItem && Object.entries(editingItem).map(([key, value]) => {
              if (key === "id" || key.includes("At")) {
                return null;
              }
              
              return (
                <div key={key} className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor={key} className="text-right">
                    {key}
                  </label>
                  <Input
                    id={key}
                    defaultValue={String(value)}
                    className="col-span-3 bg-gray-800 border-gray-700"
                    onChange={(e) => {
                      setEditingItem({
                        ...editingItem,
                        [key]: e.target.value
                      });
                    }}
                  />
                </div>
              );
            })}
          </div>
          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={handleCancelEdit}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (window.confirm('Are you sure you want to save these changes?')) {
                  handleSave(editingItem.id, editingItem);
                }
              }}
            >
              Save changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-gray-900 border border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete this {selectedEntity}? This action cannot be undone.</p>
          </div>
          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setItemToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => itemToDelete && handleDelete(itemToDelete)}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      </div>
    </AuthenticatedLayout>
  );
}
