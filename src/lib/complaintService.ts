import { Complaint, Interview, Action, HistoryEntry, User } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';



export async function checkComplaintNumberUnique(complaintNumber: string, excludeId?: string): Promise<boolean> {
  try {

    console.log('mensagem1: '+ API_URL);
    console.log('mensagem2: '+`${API_URL}`);

    const response = await fetch(`${API_URL}/api/complaints/check-number?number=${complaintNumber}${excludeId ? `&excludeId=${excludeId}` : ''}`);
    if (!response.ok) {
      
      const now_date = new Date();
      console.log('checking: '+now_date.toISOString());

      throw new Error('Failed to check complaint number uniqueness');
    }
    const data = await response.json();

    console.log(data);
    console.log(data.message);
    

    if(data.message === "Complaint not found"){
      return !data.isUnique;
    }
    return data.isUnique;
    
  } catch (error) {
    console.error('Error checking complaint number uniqueness:', error);
    throw error;
  }
}

export async function createComplaint(complaint: Partial<Complaint>) {
  try {
    // Check if complaint number is unique
    const isUnique = await checkComplaintNumberUnique(complaint.complaintNumber!);
    if (!isUnique) {
      throw new Error('Número da denúncia já existe. Por favor, escolha outro número.');
    }

    console.log(complaint);

    console.log(JSON.stringify(complaint));

    const response = await fetch(`${API_URL}/api/complaints`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(complaint),
    });

    if (!response.ok) {
      throw new Error('Failed to create complaint');
    }

    return await response.json();
  } catch (error) {

    const now_date2 = new Date();
    console.log('creating: '+now_date2.toISOString());

    console.error('Error creating complaint:', error);
    throw error;
  }
}

export async function updateComplaint(complaint: Complaint) {
  try {
    // Check if complaint number is unique (excluding current complaint)
    const isUnique = await checkComplaintNumberUnique(complaint.complaintNumber, complaint.id);
    if (!isUnique) {
      throw new Error('Número da denúncia já existe. Por favor, escolha outro número.');
    }

    const response = await fetch(`${API_URL}/api/complaints/${complaint.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(complaint),
    });

    if (!response.ok) {
      throw new Error('Failed to update complaint');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating complaint:', error);
    throw error;
  }
}

export async function fetchComplaints(currentUser?: User | null) {
  try {
    const response = await fetch(`${API_URL}/api/complaints`);
    if (!response.ok) {
      throw new Error('Failed to fetch complaints');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching complaints:', error);
    throw error;
  }
}

export async function fetchComplaintById(id: string) {
  try {
    const response = await fetch(`${API_URL}/api/complaints/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch complaint');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching complaint:', error);
    throw error;
  }
}

export async function deleteComplaint(id: string) {
  try {
    const response = await fetch(`${API_URL}/api/complaints/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete complaint');
    }
  } catch (error) {
    console.error('Error deleting complaint:', error);
    throw error;
  }
}

export async function addComplaintHistory(complaintId: string, historyEntry: Partial<HistoryEntry>) {
  try {
    const response = await fetch(`${API_URL}/api/complaints/${complaintId}/history`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(historyEntry),
    });
    if (!response.ok) {
      throw new Error('Failed to add complaint history');
    }
    return await response.json();
  } catch (error) {
    console.error('Error adding complaint history:', error);
    throw error;
  }
}

export async function addComplaintInterview(complaintId: string, interview: Partial<Interview>) {
  try {
    const response = await fetch(`${API_URL}/api/complaints/${complaintId}/interviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(interview),
    });
    if (!response.ok) {
      throw new Error('Failed to add complaint interview');
    }
    return await response.json();
  } catch (error) {
    console.error('Error adding complaint interview:', error);
    throw error;
  }
}

export async function addComplaintAction(complaintId: string, action: Partial<Action>) {
  try {
    const response = await fetch(`${API_URL}/api/complaints/${complaintId}/actions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action),
    });
    if (!response.ok) {
      throw new Error('Failed to add complaint action');
    }
    return await response.json();
  } catch (error) {
    console.error('Error adding complaint action:', error);
    throw error;
  }
}