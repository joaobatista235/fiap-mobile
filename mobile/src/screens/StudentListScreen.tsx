import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useCallback, useMemo, useState } from "react";
import { Stack, useFocusEffect, useRouter } from "expo-router";

import { UserCard } from "@/src/components/UserCard";
import { useStudents } from "@/src/hooks/useStudents";

const PAGE_SIZE = 10;

export default function StudentListScreen() {
  const router = useRouter();
  const { allStudents, isLoading, error, refresh, remove } = useStudents();

  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);

  useFocusEffect(
    useCallback(() => {
      refresh();
      setPage(0);
    }, [refresh])
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allStudents;
    return allStudents.filter(
      (s) =>
        s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q)
    );
  }, [allStudents, query]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        await remove(id);
      } catch {
        console.warn("Erro ao deletar aluno. Tente novamente.");
      }
    },
    [remove]
  );

  return (
    <View style={styles.root}>
      <Stack.Screen options={{ title: "Alunos" }} />

      <TextInput
        style={styles.search}
        placeholder="Buscar por nome ou e-mail…"
        placeholderTextColor="#9BA1A6"
        value={query}
        onChangeText={(v) => {
          setQuery(v);
          setPage(0);
        }}
        returnKeyType="search"
      />

      {isLoading && allStudents.length === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator color="#EF0024" size="large" />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable onPress={refresh} style={styles.retryBtn}>
            <Text style={styles.retryText}>Tentar novamente</Text>
          </Pressable>
        </View>
      ) : (
        <>
          <FlatList
            data={paginated}
            keyExtractor={(s) => s.id}
            renderItem={({ item }) => (
              <UserCard
                teacher={item}
                onEdit={() => router.push(`/students/${item.id}/edit`)}
                onDelete={() => handleDelete(item.id)}
              />
            )}
            contentContainerStyle={styles.list}
            refreshing={isLoading}
            onRefresh={refresh}
            ListEmptyComponent={
              <View style={styles.center}>
                <Text style={styles.emptyText}>
                  {query ? "Nenhum aluno encontrado." : "Nenhum aluno cadastrado."}
                </Text>
              </View>
            }
          />

          {totalPages > 1 && (
            <View style={styles.pagination}>
              <Pressable
                style={[styles.pageBtn, page === 0 && styles.pageBtnDisabled]}
                onPress={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
              >
                <Text style={styles.pageBtnText}>‹ Anterior</Text>
              </Pressable>

              <Text style={styles.pageInfo}>
                {page + 1} / {totalPages}
              </Text>

              <Pressable
                style={[
                  styles.pageBtn,
                  page >= totalPages - 1 && styles.pageBtnDisabled,
                ]}
                onPress={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
              >
                <Text style={styles.pageBtnText}>Próximo ›</Text>
              </Pressable>
            </View>
          )}
        </>
      )}

      <Pressable
        style={styles.fab}
        onPress={() => router.push("/students/create")}
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
  errorText: {
    color: "#D32F2F",
    fontSize: 15,
    marginBottom: 12,
    textAlign: "center",
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
  pagination: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  pageBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#EF0024",
    borderRadius: 8,
  },
  pageBtnDisabled: {
    backgroundColor: "#E0E0E0",
  },
  pageBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  pageInfo: {
    fontSize: 14,
    color: "#687076",
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
