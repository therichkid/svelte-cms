export enum PostMode {
  CREATE,
  UPDATE,
}

export const CREATE_POST_ID = 'new';

export const isCreatePost = (postId: number | string) => {
  return postId === CREATE_POST_ID;
};

export const isUpdatePost = (postId: number | string) => {
  return postId !== CREATE_POST_ID;
};
