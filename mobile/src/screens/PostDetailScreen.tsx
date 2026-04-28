import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";

import { PostService } from "@/src/api/posts";
import { useAuth } from "@/src/hooks/useAuth";
import { usePost } from "@/src/hooks/usePosts";

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const postId = Number(id);
  const router = useRouter();
  const { user } = useAuth();

  const { post, isLoading, error } = usePost(postId);

  const isAdmin = user?.role === "ADMIN";

  const handleDelete = () => {
    Alert.alert(
      "Excluir post",
      "Tem certeza que deseja excluir este post? Essa ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await PostService.delete(postId);
              router.back();
            } catch {
              Alert.alert("Erro", "Não foi possível excluir o post.");
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#EF0024" size="large" />
      </View>
    );
  }

  if (error || !post) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error ?? "Post não encontrado."}</Text>
      </View>
    );
  }

  const date = new Date(post.createdAt).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <Stack.Screen options={{ title: post.title }} />

      <ScrollView
        style={styles.root}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>{post.title}</Text>

        <View style={styles.meta}>
          {post.author && (
            <Text style={styles.author}>{post.author.name}</Text>
          )}
          <Text style={styles.date}>{date}</Text>
        </View>

        <View style={styles.divider} />

        <Text style={styles.body}>{post.content}</Text>

        {isAdmin && (
          <View style={styles.actions}>
            <Pressable
              style={[styles.btn, styles.editBtn]}
              onPress={() => router.push(`/post/${post.id}/edit`)}
            >
              <Text style={styles.btnText}>Editar</Text>
            </Pressable>
            <Pressable
              style={[styles.btn, styles.deleteBtn]}
              onPress={handleDelete}
            >
              <Text style={styles.btnText}>Excluir</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  errorText: {
    color: "#D32F2F",
    fontSize: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#11181C",
    lineHeight: 30,
    marginBottom: 12,
  },
  meta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  author: {
    fontSize: 13,
    fontWeight: "600",
    color: "#EF0024",
  },
  date: {
    fontSize: 13,
    color: "#9BA1A6",
  },
  divider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginBottom: 20,
  },
  body: {
    fontSize: 16,
    color: "#11181C",
    lineHeight: 26,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 36,
  },
  btn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  editBtn: {
    backgroundColor: "#11181C",
  },
  deleteBtn: {
    backgroundColor: "#EF0024",
  },
  btnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
});
