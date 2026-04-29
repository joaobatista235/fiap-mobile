import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useEffect, useState } from "react";
import { Stack, useRouter } from "expo-router";

import { UserService, type UpdateTeacherPayload } from "@/src/api/users";

interface Props {
  teacherId?: string;
}

export default function TeacherFormScreen({ teacherId }: Props) {
  const router = useRouter();
  const isEditing = teacherId !== undefined;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [isLoadingTeacher, setIsLoadingTeacher] = useState(isEditing);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isEditing) return;

    UserService.getById(teacherId)
      .then((t) => {
        setName(t.name);
        setEmail(t.email);
      })
      .catch(() => setError("Não foi possível carregar os dados."))
      .finally(() => setIsLoadingTeacher(false));
  }, [teacherId, isEditing]);

  const validate = (): boolean => {
    if (!name.trim()) {
      setError("O nome é obrigatório.");
      return false;
    }
    if (!email.trim() || !email.includes("@")) {
      setError("Informe um e-mail válido.");
      return false;
    }
    if (!isEditing && !password.trim()) {
      setError("A senha é obrigatória para novos professores.");
      return false;
    }
    if (password && password.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setError(null);
    setIsSubmitting(true);

    try {
      if (isEditing) {
        const payload: UpdateTeacherPayload = { name: name.trim(), email: email.trim() };
        if (password.trim()) payload.password = password.trim();
        await UserService.update(teacherId, payload);
      } else {
        await UserService.create({
          name: name.trim(),
          email: email.trim(),
          password: password.trim(),
        });
      }
      router.back();
    } catch (err: unknown) {
      const msg =
        (err as any)?.response?.data?.message ??
        "Erro ao salvar. Tente novamente.";
      setError(msg);
      Alert.alert("Erro", msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingTeacher) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#EF0024" size="large" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Stack.Screen
        options={{ title: isEditing ? "Editar Professor" : "Novo Professor" }}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.label}>Nome completo</Text>
        <TextInput
          style={styles.input}
          placeholder="Nome do professor"
          placeholderTextColor="#9BA1A6"
          value={name}
          onChangeText={setName}
          returnKeyType="next"
          editable={!isSubmitting}
        />

        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={styles.input}
          placeholder="email@instituicao.edu"
          placeholderTextColor="#9BA1A6"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          returnKeyType="next"
          editable={!isSubmitting}
        />

        <Text style={styles.label}>
          Senha{isEditing ? " (deixe em branco para não alterar)" : ""}
        </Text>
        <View style={styles.passwordRow}>
          <TextInput
            style={styles.passwordInput}
            placeholder={isEditing ? "Nova senha (opcional)" : "Mínimo 6 caracteres"}
            placeholderTextColor="#9BA1A6"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            returnKeyType="done"
            onSubmitEditing={handleSubmit}
            editable={!isSubmitting}
          />
          <Pressable
            style={styles.eyeBtn}
            onPress={() => setShowPassword((v) => !v)}
          >
            <Text style={styles.eyeLabel}>
              {showPassword ? "Ocultar" : "Mostrar"}
            </Text>
          </Pressable>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <Pressable
          style={[styles.submitBtn, isSubmitting && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitText}>
              {isEditing ? "Salvar alterações" : "Cadastrar professor"}
            </Text>
          )}
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#fff" },
  content: { padding: 20, paddingBottom: 40 },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#687076",
    marginBottom: 6,
    marginTop: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: "#11181C",
    backgroundColor: "#FAFAFA",
    marginBottom: 20,
  },
  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    backgroundColor: "#FAFAFA",
    marginBottom: 20,
    paddingRight: 12,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: "#11181C",
  },
  eyeBtn: { padding: 4 },
  eyeLabel: { fontSize: 13, color: "#EF0024", fontWeight: "600" },
  errorText: {
    color: "#D32F2F",
    fontSize: 13,
    marginBottom: 12,
    textAlign: "center",
  },
  submitBtn: {
    backgroundColor: "#EF0024",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 4,
  },
  submitBtnDisabled: { backgroundColor: "#F28B96" },
  submitText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
