USE [master]
GO
/****** Object:  Database [FAPDB]    Script Date: 2/21/2021 10:47:44 AM ******/
CREATE DATABASE [FAPDB]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'FAPDB', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL14.MSSQLSERVER\MSSQL\DATA\FAPDB.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'FAPDB_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL14.MSSQLSERVER\MSSQL\DATA\FAPDB_log.ldf' , SIZE = 73728KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
GO
ALTER DATABASE [FAPDB] SET COMPATIBILITY_LEVEL = 140
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [FAPDB].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [FAPDB] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [FAPDB] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [FAPDB] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [FAPDB] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [FAPDB] SET ARITHABORT OFF 
GO
ALTER DATABASE [FAPDB] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [FAPDB] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [FAPDB] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [FAPDB] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [FAPDB] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [FAPDB] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [FAPDB] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [FAPDB] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [FAPDB] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [FAPDB] SET  ENABLE_BROKER 
GO
ALTER DATABASE [FAPDB] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [FAPDB] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [FAPDB] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [FAPDB] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [FAPDB] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [FAPDB] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [FAPDB] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [FAPDB] SET RECOVERY FULL 
GO
ALTER DATABASE [FAPDB] SET  MULTI_USER 
GO
ALTER DATABASE [FAPDB] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [FAPDB] SET DB_CHAINING OFF 
GO
ALTER DATABASE [FAPDB] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [FAPDB] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [FAPDB] SET DELAYED_DURABILITY = DISABLED 
GO
EXEC sys.sp_db_vardecimal_storage_format N'FAPDB', N'ON'
GO
ALTER DATABASE [FAPDB] SET QUERY_STORE = OFF
GO
USE [FAPDB]
GO
/****** Object:  User [vanlthe130820]    Script Date: 2/21/2021 10:47:45 AM ******/
CREATE USER [vanlthe130820] FOR LOGIN [vanlthe130820] WITH DEFAULT_SCHEMA=[dbo]
GO
/****** Object:  Table [dbo].[attendance]    Script Date: 2/21/2021 10:47:45 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[attendance](
	[studentid] [nvarchar](50) NOT NULL,
	[course] [nvarchar](10) NOT NULL,
	[date] [nvarchar](20) NOT NULL,
	[status] [nvarchar](20) NOT NULL,
	[slot] [int] NOT NULL,
	[no] [int] NOT NULL,
	[lecturer] [nvarchar](200) NULL,
	[comment] [nvarchar](200) NULL,
	[room] [nvarchar](50) NULL,
 CONSTRAINT [PK_Attendance] PRIMARY KEY CLUSTERED 
(
	[studentid] ASC,
	[course] ASC,
	[no] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[course]    Script Date: 2/21/2021 10:47:45 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[course](
	[code] [nvarchar](10) NOT NULL,
	[course] [nvarchar](10) NOT NULL,
	[name] [nvarchar](200) NOT NULL,
	[class] [nvarchar](10) NOT NULL,
	[start] [nvarchar](10) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[course] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[headerkeepsession]    Script Date: 2/21/2021 10:47:45 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[headerkeepsession](
	[studentid] [nvarchar](50) NOT NULL,
	[session] [nvarchar](200) NOT NULL,
	[isKeep] [bit] NOT NULL,
 CONSTRAINT [PK_HeaderKeepSession] PRIMARY KEY CLUSTERED 
(
	[studentid] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[mark]    Script Date: 2/21/2021 10:47:45 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[mark](
	[studentID] [nvarchar](50) NOT NULL,
	[subjectid] [nvarchar](10) NOT NULL,
	[gradeItem] [nvarchar](50) NOT NULL,
	[weight] [float] NOT NULL,
	[value] [float] NOT NULL,
	[pos] [int] NOT NULL,
 CONSTRAINT [PK_Mark] PRIMARY KEY CLUSTERED 
(
	[studentID] ASC,
	[subjectid] ASC,
	[pos] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[otp]    Script Date: 2/21/2021 10:47:45 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[otp](
	[studentid] [nvarchar](50) NOT NULL,
	[otp] [nvarchar](4) NOT NULL,
	[expire] [int] NULL,
 CONSTRAINT [PK_Otp] PRIMARY KEY CLUSTERED 
(
	[studentid] ASC,
	[otp] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[parent]    Script Date: 2/21/2021 10:47:45 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[parent](
	[studentID] [nvarchar](50) NOT NULL,
	[fullname] [nvarchar](200) NOT NULL,
	[phone] [nvarchar](20) NULL,
	[address] [nvarchar](200) NULL,
 CONSTRAINT [PK_Parent] PRIMARY KEY CLUSTERED 
(
	[studentID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[profile]    Script Date: 2/21/2021 10:47:45 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[profile](
	[StudentID] [nvarchar](50) NOT NULL,
	[Fullname] [nvarchar](200) NOT NULL,
	[dob] [nvarchar](20) NOT NULL,
	[gender] [nvarchar](10) NULL,
	[IdCard] [nvarchar](20) NULL,
	[address] [nvarchar](200) NULL,
	[phone] [nvarchar](20) NULL,
	[mail] [nvarchar](100) NULL,
	[major] [nvarchar](3) NULL,
	[account_balance] [nvarchar](50) NULL,
	[scholarship] [nvarchar](50) NULL,
 CONSTRAINT [PK_Profile] PRIMARY KEY CLUSTERED 
(
	[StudentID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[student]    Script Date: 2/21/2021 10:47:45 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[student](
	[id] [nvarchar](50) NOT NULL,
	[Recipient] [nvarchar](200) NULL,
 CONSTRAINT [PK_Student] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[subject]    Script Date: 2/21/2021 10:47:45 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[subject](
	[id] [nvarchar](10) NOT NULL,
	[course] [nvarchar](10) NOT NULL,
	[name] [nvarchar](200) NOT NULL,
 CONSTRAINT [PK_Subject] PRIMARY KEY CLUSTERED 
(
	[course] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[course] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[timetable]    Script Date: 2/21/2021 10:47:45 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[timetable](
	[studentid] [nvarchar](50) NOT NULL,
	[dayInWeek] [int] NOT NULL,
	[slot] [int] NOT NULL,
	[course] [nvarchar](10) NULL,
	[date] [nvarchar](45) NOT NULL,
	[status] [nvarchar](45) NULL,
	[room] [nvarchar](45) NULL,
	[time] [nvarchar](45) NULL,
 CONSTRAINT [PK_Timetable] PRIMARY KEY CLUSTERED 
(
	[studentid] ASC,
	[dayInWeek] ASC,
	[slot] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[attendance] ADD  DEFAULT (NULL) FOR [lecturer]
GO
ALTER TABLE [dbo].[attendance] ADD  DEFAULT (NULL) FOR [comment]
GO
ALTER TABLE [dbo].[headerkeepsession] ADD  DEFAULT ('1') FOR [isKeep]
GO
ALTER TABLE [dbo].[otp] ADD  DEFAULT (NULL) FOR [expire]
GO
ALTER TABLE [dbo].[parent] ADD  DEFAULT (NULL) FOR [phone]
GO
ALTER TABLE [dbo].[parent] ADD  DEFAULT (NULL) FOR [address]
GO
ALTER TABLE [dbo].[profile] ADD  DEFAULT ('') FOR [StudentID]
GO
ALTER TABLE [dbo].[profile] ADD  DEFAULT (NULL) FOR [gender]
GO
ALTER TABLE [dbo].[profile] ADD  DEFAULT (NULL) FOR [IdCard]
GO
ALTER TABLE [dbo].[profile] ADD  DEFAULT (NULL) FOR [address]
GO
ALTER TABLE [dbo].[profile] ADD  DEFAULT (NULL) FOR [phone]
GO
ALTER TABLE [dbo].[profile] ADD  DEFAULT (NULL) FOR [mail]
GO
ALTER TABLE [dbo].[profile] ADD  DEFAULT (NULL) FOR [major]
GO
ALTER TABLE [dbo].[profile] ADD  DEFAULT (NULL) FOR [account_balance]
GO
ALTER TABLE [dbo].[profile] ADD  DEFAULT (NULL) FOR [scholarship]
GO
ALTER TABLE [dbo].[student] ADD  DEFAULT ('') FOR [id]
GO
ALTER TABLE [dbo].[student] ADD  DEFAULT (NULL) FOR [Recipient]
GO
ALTER TABLE [dbo].[timetable] ADD  DEFAULT (NULL) FOR [course]
GO
ALTER TABLE [dbo].[timetable] ADD  DEFAULT (NULL) FOR [status]
GO
ALTER TABLE [dbo].[timetable] ADD  DEFAULT (NULL) FOR [room]
GO
ALTER TABLE [dbo].[timetable] ADD  DEFAULT (NULL) FOR [time]
GO
ALTER TABLE [dbo].[attendance]  WITH CHECK ADD  CONSTRAINT [FK_Attendance_Course] FOREIGN KEY([course])
REFERENCES [dbo].[course] ([course])
GO
ALTER TABLE [dbo].[attendance] CHECK CONSTRAINT [FK_Attendance_Course]
GO
ALTER TABLE [dbo].[mark]  WITH CHECK ADD  CONSTRAINT [FK_Mark_Subject] FOREIGN KEY([subjectid])
REFERENCES [dbo].[subject] ([course])
GO
ALTER TABLE [dbo].[mark] CHECK CONSTRAINT [FK_Mark_Subject]
GO
ALTER TABLE [dbo].[otp]  WITH CHECK ADD  CONSTRAINT [fk_otp_student] FOREIGN KEY([studentid])
REFERENCES [dbo].[student] ([id])
GO
ALTER TABLE [dbo].[otp] CHECK CONSTRAINT [fk_otp_student]
GO
ALTER TABLE [dbo].[parent]  WITH CHECK ADD  CONSTRAINT [FK_Parent_Student] FOREIGN KEY([studentID])
REFERENCES [dbo].[student] ([id])
GO
ALTER TABLE [dbo].[parent] CHECK CONSTRAINT [FK_Parent_Student]
GO
ALTER TABLE [dbo].[profile]  WITH CHECK ADD  CONSTRAINT [FK_Profile_Student] FOREIGN KEY([StudentID])
REFERENCES [dbo].[student] ([id])
GO
ALTER TABLE [dbo].[profile] CHECK CONSTRAINT [FK_Profile_Student]
GO
ALTER TABLE [dbo].[timetable]  WITH CHECK ADD  CONSTRAINT [FK_Timetable] FOREIGN KEY([studentid])
REFERENCES [dbo].[student] ([id])
GO
ALTER TABLE [dbo].[timetable] CHECK CONSTRAINT [FK_Timetable]
GO
USE [master]
GO
ALTER DATABASE [FAPDB] SET  READ_WRITE 
GO
