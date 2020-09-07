export default class Guideline {
    constructor(serviceProviderType, guideline)
    {
        this.serviceProviderType = serviceProviderType;
        this.guideline = guideline;
        const patt = /~/g;
        if (this.guideline) this.guideline = this.guideline.replace(patt, '\n\n');
    }
}