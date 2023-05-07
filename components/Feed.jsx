"use client";

import { useState, useEffect } from "react";

import PromptCard from "./PromptCard";
import PostLoading from "./PostLoading";
import PostLoadingRow from "./PostLoadingRow";
import Link from "next/link";

const PromptCardList = ({ data, handleTagClick }) => {
  return (
    <div className="mt-16 prompt_layout">
      {data.map((post) => (
        <PromptCard
          key={post._id}
          post={post}
          handleTagClick={handleTagClick}
        />
      ))}
    </div>
  );
};

const Feed = () => {
  const [allPosts, setAllPosts] = useState([]);

  // Search states
  const [searchText, setSearchText] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchedResults, setSearchedResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);


  const fetchPosts = async () => {
    setIsLoading(true);
    const response = await fetch("/api/prompt");
    const data = await response.json();
    setAllPosts(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const filterPrompts = (searchtext) => {
    const regex = new RegExp(searchtext, "i"); // 'i' flag for case-insensitive search
    return allPosts.filter(
      (item) =>
        regex.test(item.creator.username) ||
        regex.test(item.tag) ||
        regex.test(item.prompt) || 
        regex.test(item.creator.email)  
    );
  };

  const handleSearchChange = (e)=>{
    clearTimeout(searchTimeout)
    setSearchText(e.target.value);

    // debounce method
    setSearchTimeout(
      setTimeout(() => {
        const results = filterPrompts(e.target.value);
        setSearchedResults(results);
        console.log(results)
      }, 1000)
    )
  }
 
  const handleTagClick = (tagName) => {
    setSearchText(tagName);

    const result = filterPrompts(tagName);
    setSearchedResults(result);
  };

  return (
    <>
    <section className="feed">
    <form className="relative w-full flex-center">
      <input
        type="text"
        placeholder="Search for a tag or a username"
        value={searchText}
        onChange={handleSearchChange}
        required
        className="search_input peer"
      />
    </form>
    {searchText ? <PromptCardList data={searchedResults} handleTagClick={handleTagClick} /> : <PromptCardList data={allPosts} handleTagClick={handleTagClick} />}
    
    </section>
    {isLoading && <PostLoadingRow/>}
    {allPosts.length === 0 && !isLoading && <div>
      <p className="blue_gradient not_found_text text-gray-500">No one have added Post Yet. </p>
      <p className="text-center text-gray-500 mt-4">Be first to add. <Link href={"/create-prompt"} className="orange_gradient border-b-2 border-orange-400">Create Post</Link></p>
    </div>}
    </>
  );
};

export default Feed;
