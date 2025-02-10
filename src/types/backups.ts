interface Backups {
  Backup: {
    ID: string;
    Name: string;
    Description: string;
    TargetURL: string;
    Metadata: {
      LastBackupDate: string;
      LastBackupDuration: string;
      LastBackupFinished: string;
      LastBackupStarted: string;
      LastCompactDuration: string;
      LastCompactFinished: string;
      LastCompactStarted: string;
      SourceFilesCount: string;
      TargetSizeString: string;
    };
  };
  Schedule: {
    AllowedDays: string[];
    LastRun: string;
    Repeat: string;
    Time: string;
  };
}

export type { Backups };
