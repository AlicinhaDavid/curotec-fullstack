import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";

type UserFormData = {
  id: string;
  name: string;
  email: string;
};

export default function EditUser() {
  const { register, handleSubmit, setValue } = useForm<UserFormData>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const getId = (e: React.FormEvent<HTMLFormElement>) => {
    return (
      e.currentTarget.querySelector("input[name='id']") as HTMLInputElement
    ).value;
  };
  const handleFind = async (id: string) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const res = await axios.get(`http://localhost:3000/users/${id}`);
      setValue("name", res.data.name);
      setValue("email", res.data.email);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err?.response?.data?.message || "API error.");
      } else {
        setError("Unexpected error");
      }
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: UserFormData) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      await axios.put(`http://localhost:3000/users/${data.id}`, {
        name: data.name,
        email: data.email,
      });
      setSuccessMessage("User updated successfully.");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err?.response?.data?.message || "API error.");
      } else {
        setError("Unexpected error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Edit User</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleFind(getId(e));
        }}
      >
        <input {...register("id")} placeholder="User ID" name="id" required />
        <button type="submit">Find</button>
      </form>

      <form onSubmit={handleSubmit(onSubmit)} style={{ marginTop: "1rem" }}>
        <input {...register("name")} placeholder="Name" required />
        <input
          {...register("email")}
          type="email"
          placeholder="Email"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update"}
        </button>
      </form>

      {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}
      {successMessage && (
        <p style={{ marginTop: "1rem", color: "green" }}>{successMessage}</p>
      )}
    </div>
  );
}
