"use client";

import { Model, Photo } from "@/types/app";
import React, { useState, useEffect } from "react";
import { User } from "@/types/app";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDown, ChevronUp, Pencil, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppContext } from "@/contexts/AppContext";
import { Header } from "@/components/layout/Header";

export default function DbPage() {
  const { jwtToken } = useAppContext();
  const [users, setUsers] = useState<User[]>([]);
  const [isAddModelDialogOpen, setIsAddModelDialogOpen] = useState(false);
  const [newModel, setNewModel] = useState({
    replicateId: "",
    versionId: "",
    name: "",
    description: "",
    avatarUrl: "",
    userId: "",
  });
  const [openModelIds, setOpenModelIds] = useState<string[]>([]);
  const [isAddPhotoDialogOpen, setIsAddPhotoDialogOpen] = useState(false);
  const [newPhoto, setNewPhoto] = useState({
    url: "",
    modelId: "",
    userId: "",
  });
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [isEditModelDialogOpen, setIsEditModelDialogOpen] = useState(false);
  const [isEditPhotoDialogOpen, setIsEditPhotoDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingModel, setEditingModel] = useState<Model | null>(null);
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);

  useEffect(() => {
    if (jwtToken) {
      fetchUsersAndModels();
    }
  }, [jwtToken]);

  const fetchUsersAndModels = async () => {
    try {
      const usersResponse = await fetch("/api/users", {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      if (!usersResponse.ok) {
        throw new Error("Failed to fetch users");
      }
      const userData: User[] = await usersResponse.json();

      const usersWithModelsAndPhotos = await Promise.all(
        userData.map(async (user) => {
          const modelsResponse = await fetch(`/api/models?userId=${user.id}`, {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          });
          if (modelsResponse.ok) {
            const models: Model[] = await modelsResponse.json();
            const modelsWithPhotos = await Promise.all(
              models.map(async (model) => {
                const photosResponse = await fetch(
                  `/api/photos?modelId=${model.id}`,
                  {
                    headers: {
                      Authorization: `Bearer ${jwtToken}`,
                    },
                  },
                );
                if (photosResponse.ok) {
                  const photos: Photo[] = await photosResponse.json();
                  return { ...model, photos };
                }
                return model;
              }),
            );
            return { ...user, models: modelsWithPhotos };
          }
          return user;
        }),
      );

      setUsers(usersWithModelsAndPhotos);
    } catch (error) {
      console.error("Error fetching users, models, and photos:", error);
    }
  };

  const handleAddModel = () => {
    setNewModel({ ...newModel, userId: "" });
    setIsAddModelDialogOpen(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setNewModel({ ...newModel, [name]: value });
  };

  const handleSubmitModel = async () => {
    try {
      const response = await fetch("/api/models", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(newModel),
      });

      if (!response.ok) {
        throw new Error("Failed to create model");
      }

      const createdModel = await response.json();

      setUsers(
        users.map((user) =>
          user.id === newModel.userId
            ? { ...user, models: [...(user.models || []), createdModel] }
            : user,
        ),
      );

      setIsAddModelDialogOpen(false);
      setNewModel({
        replicateId: "",
        versionId: "",
        name: "",
        description: "",
        avatarUrl: "",
        userId: "",
      });
    } catch (error) {
      console.error("Error creating model:", error);
    }
  };

  const handleAddPhoto = () => {
    setNewPhoto({ url: "", modelId: "", userId: "" });
    setIsAddPhotoDialogOpen(true);
  };

  const handlePhotoInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewPhoto((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoUserChange = (userId: string) => {
    setNewPhoto((prev) => ({ ...prev, userId, modelId: "" }));
  };

  const handlePhotoModelChange = (modelId: string) => {
    setNewPhoto((prev) => ({ ...prev, modelId }));
  };

  const handleSubmitPhoto = async () => {
    try {
      const response = await fetch("/api/photos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(newPhoto),
      });

      if (!response.ok) {
        throw new Error("Failed to create photo");
      }

      const createdPhoto = await response.json();

      setUsers(
        users.map((user) => ({
          ...user,
          models: user.models?.map((model) =>
            model.id === newPhoto.modelId
              ? { ...model, photos: [...(model.photos || []), createdPhoto] }
              : model,
          ),
        })),
      );

      setIsAddPhotoDialogOpen(false);
      setNewPhoto({ url: "", modelId: "", userId: "" });
    } catch (error) {
      console.error("Error creating photo:", error);
    }
  };

  const handleUserChange = (userId: string) => {
    setNewModel({ ...newModel, userId });
  };

  const toggleModelDropdown = (modelId: string) => {
    setOpenModelIds((prev) =>
      prev.includes(modelId)
        ? prev.filter((id) => id !== modelId)
        : [...prev, modelId],
    );
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsEditUserDialogOpen(true);
  };

  const handleEditModel = (model: Model) => {
    setEditingModel(model);
    setIsEditModelDialogOpen(true);
  };

  const handleEditPhoto = (photo: Photo) => {
    setEditingPhoto(photo);
    setIsEditPhotoDialogOpen(true);
  };

  const handleSubmitUserEdit = async () => {
    if (!editingUser) return;
    try {
      const response = await fetch(`/api/users?id=${editingUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`, // Add this line
        },
        body: JSON.stringify(editingUser),
      });

      if (!response.ok) throw new Error("Failed to update user");

      const updatedUser = await response.json();
      setUsers(users.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
      setIsEditUserDialogOpen(false);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleSubmitModelEdit = async () => {
    if (!editingModel) return;
    try {
      const response = await fetch(`/api/models?id=${editingModel.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingModel),
      });

      if (!response.ok) throw new Error("Failed to update model");

      const updatedModel = await response.json();
      setUsers(
        users.map((user) => ({
          ...user,
          models: user.models?.map((m) =>
            m.id === updatedModel.id ? updatedModel : m,
          ),
        })),
      );
      setIsEditModelDialogOpen(false);
    } catch (error) {
      console.error("Error updating model:", error);
    }
  };

  const handleSubmitPhotoEdit = async () => {
    if (!editingPhoto) return;
    try {
      const response = await fetch(`/api/photos`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingPhoto),
      });

      if (!response.ok) throw new Error("Failed to update photo");

      const updatedPhoto = await response.json();
      setUsers(
        users.map((user) => ({
          ...user,
          models: user.models?.map((model) => ({
            ...model,
            photos: model.photos?.map((p) =>
              p.id === updatedPhoto.id ? updatedPhoto : p,
            ),
          })),
        })),
      );
      setIsEditPhotoDialogOpen(false);
    } catch (error) {
      console.error("Error updating photo:", error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      const response = await fetch(`/api/users?id=${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      if (!response.ok) throw new Error("Failed to delete user");
      setUsers(users.filter((user) => user.id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleDeleteModel = async (modelId: string) => {
    try {
      const response = await fetch(`/api/models?id=${modelId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      if (!response.ok) throw new Error("Failed to delete model");
      setUsers(
        users.map((user) => ({
          ...user,
          models: user.models?.filter((model) => model.id !== modelId),
        })),
      );
    } catch (error) {
      console.error("Error deleting model:", error);
    }
  };

  const handleDeletePhoto = async (photoId: string, modelId: string) => {
    try {
      const response = await fetch(`/api/photos?id=${photoId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      if (!response.ok) throw new Error("Failed to delete photo");
      setUsers(
        users.map((user) => ({
          ...user,
          models: user.models?.map((model) =>
            model.id === modelId
              ? {
                  ...model,
                  photos: model.photos?.filter((photo) => photo.id !== photoId),
                }
              : model,
          ),
        })),
      );
    } catch (error) {
      console.error("Error deleting photo:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <div className="p-6 min-h-screen">
        <h1 className="text-2xl font-bold mb-6">Database Management</h1>
        <div className="flex space-x-4 mb-6">
          <Button
            onClick={handleAddModel}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            Add Model
          </Button>
          <Button
            onClick={handleAddPhoto}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            Add Photo
          </Button>
        </div>
        <h2 className="text-xl font-semibold mb-4">Users</h2>
        {users.length > 0 ? (
          <ul className="space-y-4">
            {users.map((user) => (
              <li key={user.id} className="border p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Button
                      onClick={() => handleEditUser(user)}
                      size="sm"
                      variant="outline"
                      className="mr-2"
                    >
                      <Pencil size={16} />
                    </Button>
                    <h3 className="font-bold">
                      {user.name} - {user.email}
                    </h3>
                  </div>
                  <Button
                    onClick={() => handleDeleteUser(user.id)}
                    size="sm"
                    variant="destructive"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
                {user.models && user.models.length > 0 ? (
                  <ul className="ml-4 mt-2 space-y-2">
                    {user.models.map((model) => (
                      <li key={model.id} className="border-l-2 pl-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Button
                              onClick={() => handleEditModel(model)}
                              size="sm"
                              variant="outline"
                              className="mr-2"
                            >
                              <Pencil size={16} />
                            </Button>
                            <h4 className="font-semibold mr-2">{model.name}</h4>
                            <button
                              onClick={() => toggleModelDropdown(model.id)}
                              className="bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300 flex items-center"
                            >
                              {openModelIds.includes(model.id) ? (
                                <ChevronUp size={16} />
                              ) : (
                                <ChevronDown size={16} />
                              )}
                            </button>
                          </div>
                          <Button
                            onClick={() => handleDeleteModel(model.id)}
                            size="sm"
                            variant="destructive"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                        {openModelIds.includes(model.id) && (
                          <div className="mt-2 ml-2 text-sm">
                            <p>
                              <strong>ID:</strong> {model.id}
                            </p>
                            <p>
                              <strong>Replicate ID:</strong>{" "}
                              {model.replicateId || ""}
                            </p>
                            <p>
                              <strong>Version ID:</strong>{" "}
                              {model.versionId || ""}
                            </p>
                            <p>
                              <strong>Description:</strong>{" "}
                              {model.description || ""}
                            </p>
                            <p>
                              <strong>Avatar URL:</strong>{" "}
                              {model.avatarUrl || ""}
                            </p>
                            <p>
                              <strong>Created At:</strong>{" "}
                              {new Date(model.createdAt).toLocaleString()}
                            </p>
                            <p>
                              <strong>User ID:</strong> {model.userId}
                            </p>
                          </div>
                        )}
                        {model.photos && model.photos.length > 0 ? (
                          <ul className="ml-4 mt-1 border-l-2 pl-2">
                            {model.photos.map((photo) => (
                              <li
                                key={photo.id}
                                className="text-sm flex items-center justify-between"
                              >
                                <div className="flex items-center">
                                  <Button
                                    onClick={() => handleEditPhoto(photo)}
                                    size="sm"
                                    variant="outline"
                                    className="mr-2"
                                  >
                                    <Pencil size={16} />
                                  </Button>
                                  <span>{photo.url}</span>
                                </div>
                                <Button
                                  onClick={() =>
                                    handleDeletePhoto(photo.id, model.id)
                                  }
                                  size="sm"
                                  variant="destructive"
                                >
                                  <Trash2 size={16} />
                                </Button>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-gray-500">
                            No photos available
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No models available</p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>Loading users...</p>
        )}
      </div>
      <Dialog
        open={isAddModelDialogOpen}
        onOpenChange={setIsAddModelDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Model</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Select onValueChange={handleUserChange} value={newModel.userId}>
              <SelectTrigger>
                <SelectValue placeholder="Select User" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              name="replicateId"
              placeholder="Replicate ID"
              value={newModel.replicateId}
              onChange={handleInputChange}
            />
            <Input
              name="versionId"
              placeholder="Version ID"
              value={newModel.versionId}
              onChange={handleInputChange}
            />
            <Input
              name="name"
              placeholder="Model Name"
              value={newModel.name}
              onChange={handleInputChange}
            />
            <Textarea
              name="description"
              placeholder="Description"
              value={newModel.description}
              onChange={handleInputChange}
            />
            <Input
              name="avatarUrl"
              placeholder="Avatar URL"
              value={newModel.avatarUrl}
              onChange={handleInputChange}
            />
          </div>
          <DialogFooter>
            <Button onClick={handleSubmitModel}>Add Model</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog
        open={isAddPhotoDialogOpen}
        onOpenChange={setIsAddPhotoDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Photo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Select
              onValueChange={handlePhotoUserChange}
              value={newPhoto.userId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select User" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              onValueChange={handlePhotoModelChange}
              value={newPhoto.modelId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Model" />
              </SelectTrigger>
              <SelectContent>
                {users
                  .find((u) => u.id === newPhoto.userId)
                  ?.models?.map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      {model.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <Input
              name="url"
              placeholder="Photo URL"
              value={newPhoto.url}
              onChange={handlePhotoInputChange}
            />
          </div>
          <DialogFooter>
            <Button onClick={handleSubmitPhoto}>Add Photo</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog
        open={isEditUserDialogOpen}
        onOpenChange={setIsEditUserDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              name="name"
              placeholder="Name"
              value={editingUser?.name || ""}
              onChange={(e) =>
                setEditingUser((prev) =>
                  prev ? { ...prev, name: e.target.value } : null,
                )
              }
            />
            <Input
              name="avatarUrl"
              placeholder="Avatar URL"
              value={editingUser?.avatarUrl || ""}
              onChange={(e) =>
                setEditingUser((prev) =>
                  prev ? { ...prev, avatarUrl: e.target.value } : null,
                )
              }
            />
          </div>
          <DialogFooter>
            <Button onClick={handleSubmitUserEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog
        open={isEditModelDialogOpen}
        onOpenChange={setIsEditModelDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Model</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              name="name"
              placeholder="Model Name"
              value={editingModel?.name || ""}
              onChange={(e) =>
                setEditingModel((prev) =>
                  prev ? { ...prev, name: e.target.value } : null,
                )
              }
            />
            <Input
              name="replicateId"
              placeholder="Replicate ID"
              value={editingModel?.replicateId || ""}
              onChange={(e) =>
                setEditingModel((prev) =>
                  prev ? { ...prev, replicateId: e.target.value } : null,
                )
              }
            />
            <Input
              name="versionId"
              placeholder="Version ID"
              value={editingModel?.versionId || ""}
              onChange={(e) =>
                setEditingModel((prev) =>
                  prev ? { ...prev, versionId: e.target.value } : null,
                )
              }
            />
            <Textarea
              name="description"
              placeholder="Description"
              value={editingModel?.description || ""}
              onChange={(e) =>
                setEditingModel((prev) =>
                  prev ? { ...prev, description: e.target.value } : null,
                )
              }
            />
            <Input
              name="avatarUrl"
              placeholder="Avatar URL"
              value={editingModel?.avatarUrl || ""}
              onChange={(e) =>
                setEditingModel((prev) =>
                  prev ? { ...prev, avatarUrl: e.target.value } : null,
                )
              }
            />
            <Select
              onValueChange={(value) =>
                setEditingModel((prev) =>
                  prev ? { ...prev, userId: value } : null,
                )
              }
              value={editingModel?.userId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select User" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button onClick={handleSubmitModelEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog
        open={isEditPhotoDialogOpen}
        onOpenChange={setIsEditPhotoDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Photo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              name="url"
              placeholder="Photo URL"
              value={editingPhoto?.url || ""}
              onChange={(e) =>
                setEditingPhoto((prev) =>
                  prev ? { ...prev, url: e.target.value } : null,
                )
              }
            />
          </div>
          <DialogFooter>
            <Button onClick={handleSubmitPhotoEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
