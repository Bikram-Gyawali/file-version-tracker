export interface FolderInterface {
  _id: string;
  name: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
}


export interface CreateFolderInterface {
    name: string;
}

export interface CreateFolderResponse {
    message: string;
    success: boolean;
}