export default class Route {
    constructor(routeId, routeName, from, destination, serviceProviderType)
    {
        this.routeId = routeId;
        this.routeName = routeName;
        this.from = from;
        this.destination = destination;
        this.serviceProviderType = serviceProviderType;
    }
}
