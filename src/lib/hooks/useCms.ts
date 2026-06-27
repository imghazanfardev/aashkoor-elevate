import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo } from "react";
import { listPublishedProducts, listPublishedPosts } from "@/lib/cms.functions";
import { toProduct, type Product } from "@/lib/data/products";

export function usePublishedProducts() {
  const fn = useServerFn(listPublishedProducts);
  const q = useQuery({
    queryKey: ["public-products"],
    queryFn: () => fn(),
    staleTime: 60_000,
  });
  const products = useMemo<Product[]>(
    () => (q.data ?? []).map(toProduct),
    [q.data],
  );
  return { ...q, products };
}

export function usePublishedPosts() {
  const fn = useServerFn(listPublishedPosts);
  return useQuery({
    queryKey: ["public-posts"],
    queryFn: () => fn(),
    staleTime: 60_000,
  });
}
