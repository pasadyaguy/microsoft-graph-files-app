export class SvcConsts {
	public static CLIENT_ID:string = "CLIENT_ID";
	public static TENANT_ID:string = "{TENANT}.onmicrosoft.com";
	public static GRAPH_RESOURCE:string = "https://graph.microsoft.com";
	public static APP_SECRET:string = "APP_SECRET";

	public static APP_TOKEN_URL:string = 'https://login.microsoftonline.com/{TENANT}.onmicrosoft.com/oauth2/token';

	//MS Graph URLs
	public static GRAPH_ONEDRIVE_URL:string = 'https://graph.microsoft.com/v1.0/me/drive/root/children';
    public static GRAPH_SITE_URL:string = 'https://graph.microsoft.com/v1.0/drives/{drive-id}/root/children';
    public static GRAPH_UPLOAD_URL:string = 'https://graph.microsoft.com/v1.0/drives/{drive-id}/root:';
    public static GRAPH_FOLDER_URL:string = 'https://graph.microsoft.com/v1.0/drives/{drive-id}/root:/TicketID:/children';
}