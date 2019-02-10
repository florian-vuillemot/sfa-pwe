export class Clients{
    constructor(clients) {
        this.clients = clients.map(c => new Client(c));
    }

    find = (name) => this.clients.find(c => c.name === name);
    get clientsName(){
        return this.clients.map(c => c.name);
    }
}

export class Client{
    constructor({id, ...args}){
        this.id = id;
        this.address = new ClientAddress(args);
    }

    get name(){return this.address.name;}
    get number(){return this.address.number;}
    get street(){return this.address.street;}
    get city(){return this.address.city;}
    get postalCode(){return this.address.postalCode;}
    get additionalAddressDetails(){return this.address.additionalAddressDetails;}
}

class ClientAddress {
    constructor({name, number, street, city, postalCode, additionalAddressDetails = null}){
        this.name = name;
        this.number = number;
        this.street = street;
        this.city = city;
        this.postalCode = postalCode; // Should be a string because "01" is valid
        this.additionalAddressDetails = additionalAddressDetails;
     }
}
