import { ConnectionManager } from "typeorm";
import { Container } from "typedi";

/**
 * Allows to inject a custom Repository using typedi's Container.
 * Use it to get the repository class decorated with @EntityRepository decorator.
 */
export function OrmCustomRepository(cls: Function, connectionName: string = "default"): Function {
    return function(object: Object|Function, propertyName: string, index?: number) {
        Container.registerHandler({ object, index, propertyName, value: () => {
            const connectionManager = Container.get(ConnectionManager);
            if (!connectionManager.has(connectionName))
                throw new Error(`Cannot get connection "${connectionName}" from the connection manager. ` +
                  `Make sure you have created such connection. Also make sure you have called useContainer(Container) ` +
                  `in your application before you established a connection and importing any entity.`);

            const connection = connectionManager.get(connectionName);
            return connection.getCustomRepository(cls as any);
        }});
    };
}
