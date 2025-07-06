import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";

type IdFormData = { id: string };

type UserFormData = {
  name: string;
  email: string;
};

export default function DeleteUser() {
  const idFormData = useForm<IdFormData>();
  const userFormData = useForm<UserFormData>();

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
      userFormData.setValue("name", res.data.name);
      userFormData.setValue("email", res.data.email);
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

  const onDelete = async (data: IdFormData) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      await axios.delete(`http://localhost:3000/users/${data.id}`);
      setSuccessMessage("User deleted.");
      userFormData.reset();
      idFormData.reset();
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
      <h1>Delete User</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleFind(getId(e));
        }}
      >
        <input
          {...idFormData.register("id")}
          placeholder="User ID"
          name="id"
          required
        />
        <button type="submit">Find</button>
      </form>

      <form
        onSubmit={idFormData.handleSubmit(onDelete)}
        style={{ marginTop: "1rem" }}
      >
        <input
          {...userFormData.register("name")}
          placeholder="Name"
          required
          readOnly
        />
        <input
          {...userFormData.register("email")}
          type="email"
          placeholder="Email"
          required
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
  );
}
