import { useForm } from "react-hook-form";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import api, { isAxiosError } from "../api";
import { UserFormData, userSchema } from "../schemas/userSchema";
import { IdFormData, idSchema } from "../schemas/idSchema";

export default function EditUser() {
  const idFormData = useForm<IdFormData>({
    resolver: zodResolver(idSchema),
  });
  const userFormData = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleFind = async (id: string) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const res = await api.get(`/users/${id}`);
      userFormData.setValue("id", String(res.data.id));
      userFormData.setValue("name", res.data.name);
      userFormData.setValue("email", res.data.email);
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        setError(err?.response?.data?.message || "API error.");
      } else {
        setError("Unexpected error");
      }
    } finally {
      setLoading(false);
    }
  };

  const onUpdate = async (data: UserFormData) => {
    console.log("onUpdate", data);
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      await api.put(`/users/${data.id}`, {
        name: data.name,
        email: data.email,
      });
      setSuccessMessage("User updated successfully.");
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        console.log("err.message", err.message);

        setError(err?.response?.data?.message || "API error.");
      } else {
        setError("Unexpected error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div style={{ padding: "2rem" }}>
        <h1>Edit User</h1>

        <form
          onSubmit={idFormData.handleSubmit((data) =>
            handleFind(data.id.toString())
          )}
        >
          <div className="inline-id-group">
            <input
              {...idFormData.register("id")}
              placeholder="User ID"
              name="id"
            />
            <button type="submit">Find</button>
            {idFormData.formState.errors.id && (
              <p style={{ color: "red" }}>
                {idFormData.formState.errors.id.message}
              </p>
            )}
          </div>
        </form>

        <form
          onSubmit={userFormData.handleSubmit(onUpdate)}
          style={{ marginTop: "1rem" }}
        >
          <input type="hidden" {...userFormData.register("id")} />
          <input {...userFormData.register("name")} placeholder="Name" />
          {userFormData.formState.errors.name && (
            <p style={{ color: "red" }}>
              {userFormData.formState.errors.name.message}
            </p>
          )}
          <input
            {...userFormData.register("email")}
            type="email"
            placeholder="Email"
          />
          {userFormData.formState.errors.email && (
            <p style={{ color: "red" }}>
              {userFormData.formState.errors.email.message}
            </p>
          )}
          <button type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update"}
          </button>
        </form>

        {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}
        {successMessage && (
          <p style={{ marginTop: "1rem", color: "green" }}>{successMessage}</p>
        )}
      </div>
    </div>
  );
}
