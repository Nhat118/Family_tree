import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import { fetchTrees, fetchTree, createTree, updateTree, deleteTree } from "../services/treeService";

const TreeContext = createContext();

export function TreeProvider({ children }) {
  const [trees, setTrees] = useState([]);
  const [activeTree, setActiveTree] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const list = await fetchTrees();
      setTrees(list);
      setLoading(false);
    })();
  }, []);

  const selectTreeById = useCallback(async (id) => {
    const t = await fetchTree(id);
    setActiveTree(t);
  }, []);

  const addTree = useCallback(async (payload) => {
    const created = await createTree(payload);
    setTrees((prev) => [created, ...prev]);
    return created;
  }, []);

  const editTree = useCallback(async (id, payload) => {
    const updated = await updateTree(id, payload);
    setTrees((prev) => prev.map(t => t.id === updated.id ? updated : t));
    setActiveTree(prev => prev?.id === updated.id ? updated : prev);
    return updated;
  }, []);

  const removeTree = useCallback(async (id) => {
    await deleteTree(id);
    setTrees((prev) => prev.filter(t => t.id !== id));
    setActiveTree(prev => prev?.id === id ? null : prev);
  }, []);

  return (
    <TreeContext.Provider
      value={{
        trees,
        activeTree,
        loading,
        selectTreeById,
        addTree,
        editTree,
        removeTree,
        setTrees,
        setActiveTree
      }}
    >
      {children}
    </TreeContext.Provider>
  );
}

export function useTree() {
  return useContext(TreeContext);
}
