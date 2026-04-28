import { Pressable, StyleSheet, Text, View } from "react-native";

import type { Post } from "@/src/types";

interface Props {
  post: Post;
  onPress: () => void;
}

export function PostCard({ post, onPress }: Props) {
  const preview =
    post.content.length > 120
      ? post.content.slice(0, 120) + "…"
      : post.content;

  const date = new Date(post.createdAt).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={onPress}
    >
      <Text style={styles.title} numberOfLines={2}>
        {post.title}
      </Text>
      <Text style={styles.preview} numberOfLines={3}>
        {preview}
      </Text>
      <View style={styles.footer}>
        {post.author ? (
          <Text style={styles.author}>{post.author.name}</Text>
        ) : (
          <View />
        )}
        <Text style={styles.date}>{date}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },
  cardPressed: {
    opacity: 0.85,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#11181C",
    marginBottom: 6,
  },
  preview: {
    fontSize: 14,
    color: "#687076",
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  author: {
    fontSize: 12,
    fontWeight: "600",
    color: "#EF0024",
  },
  date: {
    fontSize: 12,
    color: "#9BA1A6",
  },
});
