import { useForm } from "react-hook-form";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api, { isAxiosError } from "../api";

const idSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, "ID must be a number.")
    .transform((val) => Number(val))
    .refine((val) => val > 0, { message: "ID must be greater than 0." })
    .transform((val) => String(val)),
});

type IdFormData = z.infer<typeof idSchema>;
type UserFormData = { id: string; name: string; email: string };

export default function FindUser() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IdFormData>({
    resolver: zodResolver(idSchema),
  });
  const [user, setUser] = useState<UserFormData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const onSubmit = async ({ id }: IdFormData) => {
    setLoading(true);
    setUser(null);
    setError(null);
    setSuccessMessage(null);

    try {
      const res = await api.get(`/users/${id}`);

      setUser(res.data);
      setSuccessMessage("User found successfully.");
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
        <h1>Find User by ID</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="inline-id-group">
            <input {...register("id")} placeholder="User ID" />
            <button type="submit" disabled={loading}>
              {loading ? "Searching..." : "Find"}
            </button>
            {errors.id && <p style={{ color: "red" }}>{errors.id.message}</p>}
          </div>
        </form>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {successMessage && (
          <p style={{ marginTop: "1rem", color: "green" }}>{successMessage}</p>
        )}
        {user && (
          <div style={{ marginTop: "1rem" }}>
            <p>
              <strong>Name:</strong> {user.name}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
