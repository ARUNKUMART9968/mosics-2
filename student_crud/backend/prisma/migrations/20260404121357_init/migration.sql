BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Teacher] (
    [id] INT NOT NULL IDENTITY(1,1),
    [email] NVARCHAR(1000) NOT NULL,
    [password] NVARCHAR(1000) NOT NULL,
    [resetToken] NVARCHAR(1000),
    [resetTokenExpiry] DATETIME2,
    CONSTRAINT [Teacher_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Teacher_email_key] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[Student] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [regNo] NVARCHAR(1000) NOT NULL,
    [attendancePercent] FLOAT(53) NOT NULL CONSTRAINT [Student_attendancePercent_df] DEFAULT 0,
    CONSTRAINT [Student_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Student_regNo_key] UNIQUE NONCLUSTERED ([regNo])
);

-- CreateTable
CREATE TABLE [dbo].[Marks] (
    [id] INT NOT NULL IDENTITY(1,1),
    [studentId] INT NOT NULL,
    [subject1] FLOAT(53) NOT NULL CONSTRAINT [Marks_subject1_df] DEFAULT 0,
    [subject2] FLOAT(53) NOT NULL CONSTRAINT [Marks_subject2_df] DEFAULT 0,
    [subject3] FLOAT(53) NOT NULL CONSTRAINT [Marks_subject3_df] DEFAULT 0,
    [subject4] FLOAT(53) NOT NULL CONSTRAINT [Marks_subject4_df] DEFAULT 0,
    [subject5] FLOAT(53) NOT NULL CONSTRAINT [Marks_subject5_df] DEFAULT 0,
    [total] FLOAT(53) NOT NULL CONSTRAINT [Marks_total_df] DEFAULT 0,
    [percentage] FLOAT(53) NOT NULL CONSTRAINT [Marks_percentage_df] DEFAULT 0,
    CONSTRAINT [Marks_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Marks_studentId_key] UNIQUE NONCLUSTERED ([studentId])
);

-- AddForeignKey
ALTER TABLE [dbo].[Marks] ADD CONSTRAINT [Marks_studentId_fkey] FOREIGN KEY ([studentId]) REFERENCES [dbo].[Student]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
