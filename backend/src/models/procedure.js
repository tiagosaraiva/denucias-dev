const { sql, poolPromise } = require('../config/database');

class Procedure {
  static async getByComplaintId(complaintId) {
    try {
      const pool = await poolPromise;
      const result = await pool.request()
        .input('complaintId', sql.UniqueIdentifier, complaintId)
        .query('SELECT * FROM complaint_procedures WHERE complaint_id = @complaintId');
      return result.recordset;
    } catch (error) {
      throw error;
    }
  }

  static async create(procedureData) {
    try {
      const pool = await poolPromise;
      const result = await pool.request()
        .input('complaintId', sql.UniqueIdentifier, procedureData.complaint_id)
        .input('procedureType', sql.NVarChar, procedureData.procedure_type)
        .input('completed', sql.Bit, procedureData.completed || false)
        .query(`
          INSERT INTO complaint_procedures (
            complaint_id, procedure_type, completed
          )
          OUTPUT INSERTED.*
          VALUES (
            @complaintId, @procedureType, @completed
          )
        `);
      return result.recordset[0];
    } catch (error) {
      throw error;
    }
  }

  static async update(id, procedureData) {
    try {
      const pool = await poolPromise;
      const result = await pool.request()
        .input('id', sql.UniqueIdentifier, id)
        .input('procedureType', sql.NVarChar, procedureData.procedure_type)
        .input('completed', sql.Bit, procedureData.completed)
        .query(`
          UPDATE complaint_procedures
          SET 
            procedure_type = @procedureType,
            completed = @completed
          OUTPUT INSERTED.*
          WHERE id = @id
        `);
      return result.recordset[0];
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      const pool = await poolPromise;
      await pool.request()
        .input('id', sql.UniqueIdentifier, id)
        .query('DELETE FROM complaint_procedures WHERE id = @id');
      return true;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Procedure; 