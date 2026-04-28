import { useLocalSearchParams } from "expo-router";

import PostFormScreen from "@/src/screens/PostFormScreen";

export default function EditPostRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <PostFormScreen postId={Number(id)} />;
}
