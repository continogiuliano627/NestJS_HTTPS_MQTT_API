import type {ErrorLog} from 'src/database/entities/error-log.entity';

export const ErrorLogExample: ErrorLog = {
	id: '24a47693-86f7-4769-a111-4a8b3b19496d',
	sourceTable: 'User',
	sourceFunction: 'restoreDeleted',
	data: 'target User wasnt restored',
	fixed: false,
	createdAt: new Date('1997-12-22T15:13:00Z'),
	updatedAt: new Date('2025-12-22T15:13:00Z')
};
