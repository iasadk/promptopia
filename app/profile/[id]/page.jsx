"use client";
import Profile from "@/components/Profile";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import React, { useState, useEffect } from "react";

const UserProfile = () => {
  const { data: session } = useSession();
  const [posts, setPosts] = useState([]);
  const params = useParams();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  const fetchPosts = async () => {
    setIsLoading(true);
    const response = await fetch(`/api/users/${params?.id}/posts`);
    const data = await response.json();
    setPosts(data);
    setIsLoading(false);
  };

  async function handleEdit(post) {
    router.push(`/update-prompt?id=${post._id}`);
  }
  const handleDelete = async (post) => {
    const hasConfirmed = confirm(
      "Are you sure you want to delete this prompt?"
    );

    if (hasConfirmed) {
      try {
        await fetch(`/api/prompt/${post._id.toString()}`, {
          method: "DELETE",
        });

        const filteredPosts = posts.filter((item) => item._id !== post._id);

        setPosts(filteredPosts);
      } catch (error) {
        console.log(error);
      }
    }
  };
  useEffect(() => {
    console.log(session);
    if (session?.user.id) fetchPosts();
  }, []);
  return (
    <Profile
      name={""}
      desc={`Welcome to ${searchParams.get("name")+"'s"} profile page`}
      data={posts}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
      isLoading={isLoading}
    />
  );
};

export default UserProfile;
