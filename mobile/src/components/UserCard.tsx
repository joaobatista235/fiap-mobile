import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

import type { TeacherUser } from "@/src/types";

interface Props {
  teacher: TeacherUser;
  onEdit: () => void;
  onDelete: () => void;
}

export function UserCard({ teacher, onEdit, onDelete }: Props) {
  const date = new Date(teacher.createdAt).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const handleDelete = () => {
    Alert.alert(
      "Excluir professor",
      `Deseja excluir "${teacher.name}"? Esta ação não pode ser desfeita.`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", style: "destructive", onPress: onDelete },
      ]
    );
  };

  return (
    <View style={styles.card}>
      <View style={styles.info}>
        <View style={styles.avatar}>
          <Text style={styles.avatarLetter}>
            {teacher.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.text}>
          <Text style={styles.name} numberOfLines={1}>
            {teacher.name}
          </Text>
          <Text style={styles.email} numberOfLines={1}>
            {teacher.email}
          </Text>
          <Text style={styles.date}>Desde {date}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <Pressable
          style={[styles.btn, styles.editBtn]}
          onPress={onEdit}
          hitSlop={8}
        >
          <Text style={styles.btnText}>Editar</Text>
        </Pressable>
        <Pressable
          style={[styles.btn, styles.deleteBtn]}
          onPress={handleDelete}
          hitSlop={8}
        >
          <Text style={styles.btnText}>Excluir</Text>
        </Pressable>
      </View>
    </View>
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
  info: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#EF0024",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarLetter: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  text: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: "700",
    color: "#11181C",
    marginBottom: 2,
  },
  email: {
    fontSize: 13,
    color: "#687076",
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
    color: "#9BA1A6",
  },
  actions: {
    flexDirection: "row",
    gap: 10,
  },
  btn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 8,
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
    fontSize: 13,
    fontWeight: "600",
  },
});
