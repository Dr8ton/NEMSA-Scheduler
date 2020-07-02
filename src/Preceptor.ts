
type Preceptor = {
    firstName:string;
    lastName: string;
    active: boolean
}

type PreceptorList = {
    [key: string]: Preceptor
}