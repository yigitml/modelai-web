"use client";

import React, { useState, useEffect } from "react";
import { AuthenticatedLayout } from "../../../components/layout/AuthenticatedLayout";
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
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function DbPage() {
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

  useEffect(() => {
    const fetchUsersAndModels = async () => {
      try {
        const usersResponse = await fetch("/api/users");
        if (!usersResponse.ok) {
          throw new Error("Failed to fetch users");
        }
        const userData: User[] = await usersResponse.json();

        const usersWithModels = await Promise.all(
          userData.map(async (user) => {
            const modelsResponse = await fetch(`/api/models?userId=${user.id}`);
            if (modelsResponse.ok) {
              const models = await modelsResponse.json();
              return { ...user, models };
            }
            return user;
          }),
        );

        setUsers(usersWithModels);
      } catch (error) {
        console.error("Error fetching users and models:", error);
      }
    };

    fetchUsersAndModels();
  }, []);

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
        headers: { "Content-Type": "application/json" },
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
        headers: { "Content-Type": "application/json" },
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

  return (
    <AuthenticatedLayout activeTab="Database">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Database Management</h1>
        <div className="flex space-x-4 mb-6">
          <Button onClick={handleAddModel} className="bg-blue-500 hover:bg-blue-600">
            Add Model
          </Button>
          <Button onClick={handleAddPhoto} className="bg-green-500 hover:bg-green-600">
            Add Photo
          </Button>
        </div>
        <h2 className="text-xl font-semibold mb-4">Users</h2>
        {users.length > 0 ? (
          <ul className="space-y-4">
            {users.map((user) => (
              <li key={user.id} className="border p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold">
                    {user.name} - {user.email}
                  </h3>
                </div>
                {user.models && user.models.length > 0 ? (
                  <ul className="ml-4 mt-2 space-y-2">
                    {user.models.map((model) => (
                      <li key={model.id} className="border-l-2 pl-2">
                        <div className="flex justify-between items-center">
                          <h4 className="font-semibold">{model.name}</h4>
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
                          <ul className="ml-4 mt-1">
                            {model.photos.map((photo) => (
                              <li key={photo.id} className="text-sm">
                                {photo.url}
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
            <Select onValueChange={handlePhotoUserChange} value={newPhoto.userId}>
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
            <Select onValueChange={handlePhotoModelChange} value={newPhoto.modelId}>
              <SelectTrigger>
                <SelectValue placeholder="Select Model" />
              </SelectTrigger>
              <SelectContent>
                {users.find(u => u.id === newPhoto.userId)?.models?.map((model) => (
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
    </AuthenticatedLayout>
  );
}
