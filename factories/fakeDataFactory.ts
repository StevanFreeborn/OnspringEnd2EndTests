import { faker } from '@faker-js/faker';

export class FakeDataFactory {
    static createFakeFullName() {
        return faker.name.fullName();
    }

    static createFakeUsername() {
        return faker.internet.userName();
    }

    static createFakePassword() {
        return faker.internet.password(10);
    }
    
    static createFakeAppName() {
        return `${new Date().getTime().toString()}-app-test`;
    }
}