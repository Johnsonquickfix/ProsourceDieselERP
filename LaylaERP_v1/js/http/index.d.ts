interface HttpResponse<T> extends Response {
    json(): Promise<T>;
}
interface HttpOptions<T = unknown, V = unknown> {
    params?: V;
    body?: T;
    config?: Omit<RequestInit, "body" | "method">;
}
export declare class Http {
    static objectToQueryString(object: any): string;
    static searchParamsToObject(value: string): Record<string, any>;
    private static buildUrl;
    private static prepareOptions;
    private static http;
    static get<U = unknown, T = unknown>(url: string, options?: {
        params?: T;
        config?: Omit<RequestInit, "body" | "method">;
    }): Promise<HttpResponse<U>>;
    static post<U = unknown, T = unknown, V = unknown>(url: string, options?: HttpOptions<T, V>): Promise<HttpResponse<U>>;
    static patch<U = unknown, T = unknown, V = unknown>(url: string, options?: HttpOptions<T, V>): Promise<HttpResponse<U>>;
    static put<U = unknown, T = unknown, V = unknown>(url: string, options?: HttpOptions<T, V>): Promise<HttpResponse<U>>;
    static delete<U = unknown, T = unknown, V = unknown>(url: string, options?: HttpOptions<T, V>): Promise<HttpResponse<U>>;
}
export {};
