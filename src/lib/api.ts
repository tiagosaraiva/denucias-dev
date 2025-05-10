const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export async function fetchComplaints() {
  const response = await fetch(`${API_URL}/complaints`);
  if (!response.ok) {
    throw new Error('Failed to fetch complaints');
  }
  return response.json();
}

export async function fetchComplaintById(id: string) {
  const response = await fetch(`${API_URL}/complaints/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch complaint');
  }
  return response.json();
}

export async function createComplaint(complaintData: any) {
  const response = await fetch(`${API_URL}/complaints`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(complaintData),
  });
  if (!response.ok) {
    throw new Error('Failed to create complaint');
  }
  return response.json();
}

export async function updateComplaint(id: string, complaintData: any) {
  const response = await fetch(`${API_URL}/complaints/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(complaintData),
  });
  if (!response.ok) {
    throw new Error('Failed to update complaint');
  }
  return response.json();
}

export async function deleteComplaint(id: string) {
  const response = await fetch(`${API_URL}/complaints/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete complaint');
  }
  return response.json();
}

export async function fetchComplaintStatusSummary() {
  const response = await fetch(`${API_URL}/complaints/status-summary`);
  if (!response.ok) {
    throw new Error('Failed to fetch status summary');
  }
  return response.json();
}

export async function fetchComplaintsByCategory() {
  const response = await fetch(`${API_URL}/complaints/by-category`);
  if (!response.ok) {
    throw new Error('Failed to fetch complaints by category');
  }
  return response.json();
}

// Procedures
export async function createProcedure(complaintId: string, procedureData: any) {
  const response = await fetch(`${API_URL}/procedures`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...procedureData, complaint_id: complaintId }),
  });
  if (!response.ok) {
    throw new Error('Failed to create procedure');
  }
  return response.json();
}

// Interviews
export async function createInterview(complaintId: string, interviewData: any) {
  const response = await fetch(`${API_URL}/interviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...interviewData, complaint_id: complaintId }),
  });
  if (!response.ok) {
    throw new Error('Failed to create interview');
  }
  return response.json();
}

// Actions
export async function createAction(complaintId: string, actionData: any) {
  const response = await fetch(`${API_URL}/actions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...actionData, complaint_id: complaintId }),
  });
  if (!response.ok) {
    throw new Error('Failed to create action');
  }
  return response.json();
}

// Conclusions
export async function createConclusion(complaintId: string, conclusionData: any) {
  const response = await fetch(`${API_URL}/conclusions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...conclusionData, complaint_id: complaintId }),
  });
  if (!response.ok) {
    throw new Error('Failed to create conclusion');
  }
  return response.json();
} 