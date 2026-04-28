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

import { PostCard } from "@/src/components/PostCard";
import { useAuth } from "@/src/hooks/useAuth";
import { usePosts } from "@/src/hooks/usePosts";

export default function PostListScreen() {
  const { user, signOut } = useAuth();
  const { posts, isLoading, error, refresh } = usePosts();
  const router = useRouter();

  const [query, setQuery] = useState("");

  const isAdmin = user?.role === "ADMIN";

  // Recarrega a lista sempre que a tela entra em foco.
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

  const handleSignOut = () => {
    Alert.alert("Sair", "Deseja sair da sua conta?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Sair", style: "destructive", onPress: () => signOut() },
    ]);
  };

  return (
    <View style={styles.root}>
      <Stack.Screen
        options={{
          title: "FIAP Blog",
          headerRight: () => (
            <View style={styles.headerRight}>
              {isAdmin && (
                <>
                  <Pressable
                    onPress={() => router.push("/admin/posts")}
                    style={styles.headerBtn}
                  >
                    <Text style={styles.headerBtnText}>Admin</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => router.push("/students")}
                    style={styles.headerBtn}
                  >
                    <Text style={styles.headerBtnText}>Alunos</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => router.push("/teachers")}
                    style={styles.headerBtn}
                  >
                    <Text style={styles.headerBtnText}>Professores</Text>
                  </Pressable>
                </>
              )}
              <Pressable onPress={handleSignOut} style={styles.headerBtn}>
                <Text style={styles.headerBtnText}>Sair</Text>
              </Pressable>
            </View>
          ),
        }}
      />

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
          renderItem={({ item }) => (
            <PostCard
              post={item}
              onPress={() => router.push(`/post/${item.id}`)}
            />
          )}
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

      {isAdmin && (
        <Pressable
          style={styles.fab}
          onPress={() => router.push("/post/create")}
        >
          <Text style={styles.fabIcon}>+</Text>
        </Pressable>
      )}
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
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginRight: 4,
  },
  headerBtn: {
    padding: 6,
  },
  headerBtnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
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
