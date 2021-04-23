/**
 * Structure de donnees pour définir des partenaires qui seront affichés à l'écran de connection.
 * */
export class Partner {
    name: string;
    uri: string | undefined;

    constructor(name: string, uri: string | undefined = undefined) {
        this.name = name;
        this.uri = uri;
    }
}