const { useState, useEffect } = React;

const CLIENT_ID = '330408379765-sd6nljvet6d83ccihrp2on9eueqf3604.apps.googleusercontent.com';
const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/tasks.readonly';

const CalendarModule = () => {
    const [events, setEvents] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [token, setToken] = useState('');
    const [tokenClient, setTokenClient] = useState(null);

    useEffect(() => {
        /* global google */
        const handleClientLoad = () => {
            const savedToken = localStorage.getItem('accessToken');
            if (savedToken) {
                setToken(savedToken);
                setIsAuthenticated(true);
                fetchEventsAndTasks(savedToken);
            }

            const tokenClient = google.accounts.oauth2.initTokenClient({
                client_id: CLIENT_ID,
                scope: SCOPES,
                callback: (tokenResponse) => {
                    const access_token = tokenResponse.access_token;

                    if (access_token) {
                        setToken(access_token);
                        setIsAuthenticated(true);
                        fetchEventsAndTasks(access_token);
                    }
                },
            });

            setTokenClient(tokenClient);
        };

        handleClientLoad();
    }, []);

    const fetchEventsAndTasks = async (token) => {
        try {
            const [events, tasks] = await Promise.all([fetchCalendarEvents(token), fetchGoogleTasks(token)]);
            const combined = [...events, ...tasks];
            combined.sort((a, b) => new Date(a.start?.dateTime || a.due || a.start.date) - new Date(b.start?.dateTime || b.due || b.start.date));
            setEvents(combined);
        } catch (error) {
            console.error('Error fetching events and tasks:', error);
        }
    };

    const fetchCalendarEvents = async (token) => {
        const response = await fetch(
            `https://www.googleapis.com/calendar/v3/calendars/primary/events?maxResults=7&orderBy=startTime&singleEvents=true&timeMin=${new Date().toISOString()}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        return data.items;
    };

    const fetchGoogleTasks = async (token) => {
        const response = await fetch(`https://www.googleapis.com/tasks/v1/lists/@default/tasks?showCompleted=false&dueMin=${new Date().toISOString()}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        return data.items.map(task => ({
            id: task.id,
            summary: task.title,
            start: { dateTime: task.due },
            end: { dateTime: task.due },
        }));
    };

    const handleSigninClick = (event) => {
        tokenClient.requestAccessToken();
    };

    const handleSignoutClick = () => {
        setIsAuthenticated(false);
        setEvents([]);
    };

    const formatDayOfMonth = (date) => {
        return new Date(date).getDate();
    };

    const formatMonthAndDay = (date) => {
        const options = { month: 'short', weekday: 'short' };
        return new Date(date).toLocaleDateString(undefined, options).toUpperCase().replace(' ', ', ');
    };

    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="bg-gray-800 p-4 rounded-md">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl text-white">Upcoming Events</h3>
            </div>
            {!isAuthenticated ? (
                <div>
                    <button onClick={handleSigninClick} id="signInDiv" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Sign in with Google
                    </button>
                </div>
            ) : (
                <div>
                    <button onClick={handleSignoutClick} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-1 px-2 rounded text-sm">
                        Sign out
                    </button>
                    <ul className="space-y-2">
                        {events.map(event => (
                            <li key={event.id} className="grid grid-cols-12 items-center border-b border-gray-600 pb-2 gap-2">
                                <div className="text-right text-white text-2xl col-span-1">{formatDayOfMonth(event.start.dateTime || event.start.date)}</div>
                                <div className="text-left text-white col-span-2">{formatMonthAndDay(event.start.dateTime || event.start.date)}</div>
                                <div className="text-left text-white col-span-3">{formatTime(event.start.dateTime || event.start.date)} - {formatTime(event.end.dateTime || event.end.date)}</div>
                                <div className="text-left text-white col-span-6">{event.summary}</div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};
