import { useForm } from "react-hook-form";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import api, { isAxiosError } from "../api";
import { IdFormData, idSchema } from "../schemas/idSchema";
import { UserWithoutId } from "../types/UserWithoutId";

type UserFormData = UserWithoutId;

export default function DeleteUser() {
  const idFormData = useForm<IdFormData>({
    resolver: zodResolver(idSchema),
  });
  const userFormData = useForm<UserFormData>();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleFind = async (id: string) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const res = await api.get(`/users/${id}`);
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

  const onDelete = async (data: IdFormData) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      await api.delete(`/users/${data.id}`);
      setSuccessMessage("User deleted.");
      userFormData.reset();
      idFormData.reset();
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

  return (
    <div className="container">
      <div style={{ padding: "2rem" }}>
        <h1>Delete User</h1>

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
          onSubmit={idFormData.handleSubmit(onDelete)}
          style={{ marginTop: "1rem" }}
        >
          <input
            {...userFormData.register("name")}
            placeholder="Name"
            readOnly
          />
          <input
            {...userFormData.register("email")}
            placeholder="Email"
            readOnly
          />
          <button type="submit" disabled={loading}>
            {loading ? "Deleting..." : "Delete"}
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
