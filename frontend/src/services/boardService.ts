import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://holy-cross-convent-school-brooklyn.onrender.com/api';
// Updated to use deployed backend

export interface BoardMember {
  id: string;
  name: string;
  role: string;
  position?: string;
  type: 'EXECUTIVE' | 'REPRESENTATIVE' | 'MEMBER';
  email?: string;
  phone?: string;
  bio?: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export const boardService = {
  // Get all board members
  async getAllBoardMembers(): Promise<BoardMember[]> {
    const response = await axios.get(`${API_URL}/board`);
    return response.data;
  },

  // Get board members by type
  async getBoardMembersByType(type: string): Promise<BoardMember[]> {
    const response = await axios.get(`${API_URL}/board/type/${type}`);
    return response.data;
  },

  // Get single board member
  async getBoardMemberById(id: string): Promise<BoardMember> {
    const response = await axios.get(`${API_URL}/board/${id}`);
    return response.data;
  },

  // Create board member (admin only)
  async createBoardMember(data: Partial<BoardMember>): Promise<BoardMember> {
    const token = localStorage.getItem('adminToken');
    const response = await axios.post(`${API_URL}/board`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  // Update board member (admin only)
  async updateBoardMember(id: string, data: Partial<BoardMember>): Promise<BoardMember> {
    const token = localStorage.getItem('adminToken');
    const response = await axios.put(`${API_URL}/board/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  // Delete board member (admin only)
  async deleteBoardMember(id: string): Promise<void> {
    const token = localStorage.getItem('adminToken');
    await axios.delete(`${API_URL}/board/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },

  // Reorder board members (admin only)
  async reorderBoardMembers(boardMembers: { id: string; order: number }[]): Promise<void> {
    const token = localStorage.getItem('adminToken');
    await axios.post(`${API_URL}/board/reorder`, { boardMembers }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
};

export default boardService;

