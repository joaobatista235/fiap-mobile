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

import { PostService, type UpdatePostPayload } from "@/src/api/posts";
import type { Post } from "@/src/types";

interface Props {
  /** Se fornecido, entra em modo de edição — busca e pre-popula o post. */
  postId?: number;
}

export default function PostFormScreen({ postId }: Props) {
  const router = useRouter();
  const isEditing = postId !== undefined;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoadingPost, setIsLoadingPost] = useState(isEditing);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Edição: carrega o post e preenche o formulário.
  useEffect(() => {
    if (!isEditing) return;

    PostService.getById(postId)
      .then((post: Post) => {
        setTitle(post.title);
        setContent(post.content);
      })
      .catch(() => setError("Não foi possível carregar o post."))
      .finally(() => setIsLoadingPost(false));
  }, [postId, isEditing]);

  const validate = (): boolean => {
    if (!title.trim()) {
      setError("O título é obrigatório.");
      return false;
    }
    if (!content.trim()) {
      setError("O conteúdo é obrigatório.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setError(null);
    setIsSubmitting(true);

    const payload: UpdatePostPayload = {
      title: title.trim(),
      content: content.trim(),
    };

    try {
      if (isEditing) {
        await PostService.update(postId, payload);
      } else {
        await PostService.create(payload);
      }
      router.back();
    } catch (err: unknown) {
      const msg =
        (err as any)?.response?.data?.message ??
        "Erro ao salvar o post. Tente novamente.";
      setError(msg);
      Alert.alert("Erro", msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingPost) {
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
        options={{ title: isEditing ? "Editar Post" : "Novo Post" }}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.label}>Título</Text>
        <TextInput
          style={styles.input}
          placeholder="Título do post"
          placeholderTextColor="#9BA1A6"
          value={title}
          onChangeText={setTitle}
          returnKeyType="next"
          editable={!isSubmitting}
          maxLength={200}
        />

        <Text style={styles.label}>Conteúdo</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Escreva o conteúdo do post…"
          placeholderTextColor="#9BA1A6"
          value={content}
          onChangeText={setContent}
          multiline
          textAlignVertical="top"
          editable={!isSubmitting}
        />

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
              {isEditing ? "Salvar alterações" : "Publicar post"}
            </Text>
          )}
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
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
  textArea: {
    minHeight: 220,
    lineHeight: 22,
  },
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
  submitBtnDisabled: {
    backgroundColor: "#F28B96",
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
