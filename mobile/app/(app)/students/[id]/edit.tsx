import { useLocalSearchParams } from "expo-router";

import StudentFormScreen from "@/src/screens/StudentFormScreen";

export default function EditStudentRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <StudentFormScreen studentId={id} />;
}
