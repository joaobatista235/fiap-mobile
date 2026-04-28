import { useLocalSearchParams } from "expo-router";

import TeacherFormScreen from "@/src/screens/TeacherFormScreen";

export default function EditTeacherRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <TeacherFormScreen teacherId={id} />;
}
