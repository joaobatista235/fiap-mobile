import { Stack } from "expo-router";

const HEADER = {
  headerStyle: { backgroundColor: "#EF0024" },
  headerTintColor: "#fff",
  headerTitleStyle: { fontWeight: "700" as const },
};

export default function AppLayout() {
  return (
    <Stack screenOptions={HEADER}>
      {/* Posts */}
      <Stack.Screen name="index" options={{ title: "FIAP Blog" }} />
      <Stack.Screen name="post/[id]" options={{ title: "Post" }} />
      <Stack.Screen name="post/create" options={{ title: "Novo Post" }} />
      <Stack.Screen name="post/[id]/edit" options={{ title: "Editar Post" }} />

      {/* Professores */}
      <Stack.Screen name="teachers/index" options={{ title: "Professores" }} />
      <Stack.Screen name="teachers/create" options={{ title: "Novo Professor" }} />
      <Stack.Screen name="teachers/[id]/edit" options={{ title: "Editar Professor" }} />

      {/* Alunos */}
      <Stack.Screen name="students/index" options={{ title: "Alunos" }} />
      <Stack.Screen name="students/create" options={{ title: "Novo Aluno" }} />
      <Stack.Screen name="students/[id]/edit" options={{ title: "Editar Aluno" }} />

      {/* Admin */}
      <Stack.Screen name="admin/posts" options={{ title: "Gerenciar Posts" }} />
    </Stack>
  );
}
