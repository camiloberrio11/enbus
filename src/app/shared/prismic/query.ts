/// Modelo para realizar peticiones a prismic dependiendo del tipo o nombre de la información
export class Query {
    public static byType(type: string): string {
        return `[at(document.type, "${type}")]`;
    }

    public static byField(type: string, filed: string, value: string): string {
        return `[at(my.${type}.${filed}, "${value}")]`;
    }
}
