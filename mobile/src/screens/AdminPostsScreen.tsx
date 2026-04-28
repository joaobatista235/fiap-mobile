import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useCallback, useState } from "react";
import { Stack, useFocusEffect, useRouter } from "expo-router";

import { usePosts } from "@/src/hooks/usePosts";
import type { Post } from "@/src/types";

export default function AdminPostsScreen() {
  const router = useRouter();
  const { posts, isLoading, error, refresh, remove } = usePosts();

  const [query, setQuery] = useState("");

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  const filtered = query.trim()
    ? posts.filter(
        (p) =>
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.content.toLowerCase().includes(query.toLowerCase())
      )
    : posts;

  const handleDelete = useCallback(
    (post: Post) => {
      Alert.alert(
        "Excluir post",
        `Deseja excluir "${post.title}"? Esta ação não pode ser desfeita.`,
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Excluir",
            style: "destructive",
            onPress: async () => {
              try {
                await remove(post.id);
              } catch {
                Alert.alert("Erro", "Não foi possível excluir o post.");
              }
            },
          },
        ]
      );
    },
    [remove]
  );

  const renderItem = useCallback(
    ({ item }: { item: Post }) => (
      <View style={styles.card}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {item.title}
        </Text>
        {item.author && (
          <Text style={styles.cardMeta}>por {item.author.name}</Text>
        )}
        <Text style={styles.cardMeta}>
          {new Date(item.createdAt).toLocaleDateString("pt-BR")}
        </Text>
        <View style={styles.cardActions}>
          <Pressable
            style={[styles.actionBtn, styles.editBtn]}
            onPress={() => router.push(`/post/${item.id}/edit`)}
          >
            <Text style={styles.actionBtnText}>Editar</Text>
          </Pressable>
          <Pressable
            style={[styles.actionBtn, styles.deleteBtn]}
            onPress={() => handleDelete(item)}
          >
            <Text style={styles.actionBtnText}>Excluir</Text>
          </Pressable>
        </View>
      </View>
    ),
    [router, handleDelete]
  );

  return (
    <View style={styles.root}>
      <Stack.Screen options={{ title: "Gerenciar Posts" }} />

      <TextInput
        style={styles.search}
        placeholder="Buscar posts…"
        placeholderTextColor="#9BA1A6"
        value={query}
        onChangeText={setQuery}
        returnKeyType="search"
      />

      {error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable onPress={refresh} style={styles.retryBtn}>
            <Text style={styles.retryText}>Tentar novamente</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(p) => String(p.id)}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshing={isLoading}
          onRefresh={refresh}
          ListEmptyComponent={
            !isLoading ? (
              <View style={styles.center}>
                <Text style={styles.emptyText}>Nenhum post encontrado.</Text>
              </View>
            ) : null
          }
          ListHeaderComponent={
            isLoading && filtered.length === 0 ? (
              <ActivityIndicator
                color="#EF0024"
                style={styles.loader}
                size="large"
              />
            ) : null
          }
        />
      )}

      <Pressable
        style={styles.fab}
        onPress={() => router.push("/post/create")}
      >
        <Text style={styles.fabIcon}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  search: {
    margin: 16,
    marginBottom: 8,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: "#11181C",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 100,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
  },
  loader: {
    marginTop: 40,
  },
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
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#11181C",
    marginBottom: 4,
  },
  cardMeta: {
    fontSize: 12,
    color: "#9BA1A6",
    marginBottom: 2,
  },
  cardActions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  editBtn: {
    backgroundColor: "#1A73E8",
  },
  deleteBtn: {
    backgroundColor: "#D32F2F",
  },
  actionBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 13,
  },
  errorText: {
    color: "#D32F2F",
    fontSize: 15,
    marginBottom: 12,
  },
  retryBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#EF0024",
    borderRadius: 8,
  },
  retryText: {
    color: "#fff",
    fontWeight: "600",
  },
  emptyText: {
    color: "#9BA1A6",
    fontSize: 15,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 28,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#EF0024",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  fabIcon: {
    color: "#fff",
    fontSize: 30,
    lineHeight: 34,
    fontWeight: "300",
  },
});
