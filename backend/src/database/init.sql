-- Create the database if it doesn't exist
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'complaints_db')
BEGIN
    CREATE DATABASE complaints_db;
END
GO

USE complaints_db;
GO

-- Criar tabela de denúncias
CREATE TABLE complaints (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    number NVARCHAR(50) UNIQUE NOT NULL,
    category NVARCHAR(100) NOT NULL,
    characteristic NVARCHAR(100) NOT NULL,
    status NVARCHAR(20) NOT NULL CHECK (status IN ('nova', 'investigacao', 'concluida', 'arquivada')),
    responsible_instance NVARCHAR(100) NOT NULL,
    responsible1 NVARCHAR(100) NULL,
    responsible2 NVARCHAR(100) NULL,
    received_date DATE NOT NULL,
    description NVARCHAR(MAX),
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE()
);

-- Tabela de procedimentos
CREATE TABLE complaint_procedures (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    complaint_id UNIQUEIDENTIFIER FOREIGN KEY REFERENCES complaints(id) ON DELETE CASCADE,
    procedure_type NVARCHAR(50) NOT NULL CHECK (
        procedure_type IN (
            'Entrevista',
            'Análise Documentos',
            'Análise Áudio e vídeo',
            'Análise Acessos',
            'Análise Sistemas',
            'Perito'
        )
    ),
    completed BIT DEFAULT 0,
    created_at DATETIME2 DEFAULT GETDATE()
);

-- Tabela de entrevistas
CREATE TABLE complaint_interviews (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    complaint_id UNIQUEIDENTIFIER FOREIGN KEY REFERENCES complaints(id) ON DELETE CASCADE,
    interview_type NVARCHAR(50) NOT NULL CHECK (
        interview_type IN ('Testemunha', 'Denunciado', 'Denunciante')
    ),
    scheduled_date DATE NOT NULL,
    transcription NVARCHAR(MAX),
    created_at DATETIME2 DEFAULT GETDATE()
);

-- Tabela de ações
CREATE TABLE complaint_actions (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    complaint_id UNIQUEIDENTIFIER FOREIGN KEY REFERENCES complaints(id) ON DELETE CASCADE,
    action_type NVARCHAR(100) NOT NULL,
    description NVARCHAR(MAX) NOT NULL,
    responsible NVARCHAR(100) NOT NULL,
    status NVARCHAR(50) NOT NULL CHECK (
        status IN ('Não iniciado', 'Em andamento', 'Concluído', 'Cancelado', 'Parado')
    ),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    observation NVARCHAR(MAX),
    created_at DATETIME2 DEFAULT GETDATE(),
    CONSTRAINT end_date_after_start_date CHECK (end_date >= start_date)
);

-- Tabela de conclusões
CREATE TABLE complaint_conclusions (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    complaint_id UNIQUEIDENTIFIER FOREIGN KEY REFERENCES complaints(id) ON DELETE CASCADE,
    procedencia NVARCHAR(50) NOT NULL CHECK (
        procedencia IN ('Improcedente', 'Procedente', 'Parcialmente procedente', 'Inconclusiva')
    ),
    closing_date DATE NOT NULL,
    justification NVARCHAR(MAX) NOT NULL,
    ceo_approval_status NVARCHAR(20) NOT NULL CHECK (
        ceo_approval_status IN ('pending', 'approved', 'rejected')
    ),
    ceo_approval_date DATE,
    ceo_comments NVARCHAR(MAX),
    created_at DATETIME2 DEFAULT GETDATE()
);

-- Índices para otimizar consultas comuns
CREATE INDEX idx_complaints_status ON complaints(status);
CREATE INDEX idx_complaints_category ON complaints(category);
CREATE INDEX idx_complaints_received_date ON complaints(received_date);
CREATE INDEX idx_complaints_responsible1 ON complaints(responsible1);
CREATE INDEX idx_complaint_actions_status ON complaint_actions(status);
CREATE INDEX idx_complaint_conclusions_procedencia ON complaint_conclusions(procedencia);

GO

-- Trigger para atualizar updated_at
CREATE TRIGGER tr_complaints_update_updated_at
ON complaints
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE complaints
    SET updated_at = GETDATE()
    FROM complaints c
    INNER JOIN inserted i ON c.id = i.id;
END;

GO

-- Views para relatórios comuns
CREATE VIEW complaint_status_summary AS
SELECT 
    status,
    COUNT(*) as total,
    COUNT(CASE WHEN YEAR(received_date) = YEAR(GETDATE()) THEN 1 END) as total_this_year,
    AVG(CAST(DATEDIFF(SECOND, created_at, updated_at) AS FLOAT)/86400.0) as avg_days_to_resolution
FROM complaints
GROUP BY status;

GO

CREATE VIEW complaints_by_category AS
SELECT 
    category,
    COUNT(*) as total,
    COUNT(CASE WHEN status = 'concluida' THEN 1 END) as concluded,
    COUNT(CASE WHEN status = 'investigacao' THEN 1 END) as in_progress
FROM complaints
GROUP BY category;

GO

CREATE VIEW pending_actions AS
SELECT 
    c.number as complaint_number,
    c.category,
    a.action_type,
    a.description,
    a.responsible,
    a.status,
    a.start_date,
    a.end_date
FROM complaints c
JOIN complaint_actions a ON c.id = a.complaint_id
WHERE a.status IN ('Não iniciado', 'Em andamento')
ORDER BY a.end_date; 