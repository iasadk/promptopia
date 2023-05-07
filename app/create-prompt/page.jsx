"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import Form from "@/components/Form";
const CreatePrompt = () => {
    const router = useRouter();
  const { data: session } = useSession();
  const [submitting, setIsSubmitting] = useState(false);
  const [post, setPost] = useState({ prompt: "", tag: "" });
  const createPrompt = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    if(!session) return router.replace("https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount?client_id=111145496146-dqrsiubogutksjt347gduvgll379809f.apps.googleusercontent.com&scope=openid%20email%20profile&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Fcallback%2Fgoogle&state=3r2n4m30JykHKqV6dwjTSNRabsC-Sya6O-dECCer7MY&code_challenge=5RN8A_V9Apw5W9AF0gT-3FPNK5mfUjHtphcpJxlRJtA&code_challenge_method=S256&service=lso&o2v=2&flowName=GeneralOAuthFlow");
    try {
      const response = await fetch("/api/prompt/new", {
        method: "POST",
        body: JSON.stringify({
          prompt: post.prompt,
          userId: session?.user.id,
          tag: post.tag,
        }),
      });

      if (response.ok) {
        router.push("/");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <Form
    type='Create'
    post={post}
    setPost={setPost}
    submitting={submitting}
    handleSubmit={createPrompt}
  />
  )
}

export default CreatePrompt