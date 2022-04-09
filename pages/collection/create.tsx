import type { NextPage } from "next";
import { useState } from "react";
import { useRouter } from "next/router";

import { Layout } from "components";
import classes from "styles/Forms.module.scss";
import useAuth from "utils/useAuth";
import fetchApi, { FetchError } from "utils/fetchApi";
import { Collection } from "types";

const CreateCollection: NextPage = () => {
  const router = useRouter();
  useAuth({ redirectTo: "/login" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const handleChange =
    (key: keyof typeof form) =>
    (evt: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm({ ...form, [key]: evt.target.value });

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setError(null);
      setLoading(true);
      const collection = await fetchApi<Collection>("/api/collections", {
        method: "POST",
        body: JSON.stringify(form),
        headers: {
          "Content-Type": "application/json",
        },
      });
      setLoading(false);
      router.push(`/collections/${collection.id}`);
    } catch (err) {
      if (err instanceof FetchError) setError(err.data?.message ?? err.message);
      else {
        console.error(err);
        setError("An unexpected error occurred");
      }
    }
  };

  return (
    <Layout className={classes.layout}>
      <form onSubmit={onSubmit} className={classes.form}>
        <h1>Create a new collection</h1>
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={handleChange("name")}
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={handleChange("description")}
        />
        {error && <p className={classes.error}>{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Create"}
        </button>
      </form>
    </Layout>
  );
};

export default CreateCollection;
