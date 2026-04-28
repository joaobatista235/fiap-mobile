export type AuthStackParamList = {
  login: undefined;
};

export type AppStackParamList = {
  index: undefined;
  "post/[id]": { id: string };
  "post/create": undefined;
  "post/[id]/edit": { id: string };
  "teachers/index": undefined;
  "teachers/create": undefined;
  "teachers/[id]/edit": { id: string };
  "students/index": undefined;
  "students/create": undefined;
  "students/[id]/edit": { id: string };
  "admin/posts": undefined;
};
