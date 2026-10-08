import "react-native-gesture-handler";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from "react-native";
import * as SecureStore from "expo-secure-store";
import { NavigationContainer, DrawerActions, useNavigation } from "@react-navigation/native";
import { createDrawerNavigator, DrawerContentComponentProps, DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { StatusBar } from "expo-status-bar";

type Movie = { id: number; title: string; overview?: string; posterPath?: string | null; releaseYear?: string | null; voteAverage?: number; genres?: string[]; mediaType?: "movie" | "tv" };
type Game = { id: number; title: string; description?: string; coverUrl?: string | null; releaseYear?: string | null; rating?: number; genres?: string[]; status?: string };
type Book = { id: string; title: string; authors?: string[]; coverUrl?: string | null; firstPublishYear?: number | null; pageCount?: number | null; status?: string; currentPage?: number };
type User = { id: string; name: string; email: string };
type LibraryItem = (Movie | Game | Book) & { status?: string };
type RootDrawerParamList = { Movies: undefined; Watched: undefined; Pending: undefined; Watching: undefined; Games: undefined; Books: undefined; Reading: undefined; Read: undefined; BookPending: undefined };

const Drawer = createDrawerNavigator<RootDrawerParamList>();
const TOKEN_KEY = "watchlog.auth.token";
const API_URL = (process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:4000").replace(/\/$/, "");

async function api<T>(path: string, init?: RequestInit) {
  const token = await SecureStore.getItemAsync(TOKEN_KEY);
  const response = await fetch(`${API_URL}${path}`, { ...init, headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}), ...init?.headers } });
  if (!response.ok) throw new Error("No se pudo conectar con Watchlog.");
  return response.status === 204 ? undefined as T : await response.json() as T;
}

function LoginScreen({ onLogin }: { onLogin: (user: User, token: string) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registering, setRegistering] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const submit = async () => {
    try {
      const path = registering ? "/api/auth/register" : "/api/auth/login";
      const body = registering ? { name, email, password } : { email, password };
      const result = await api<{ user: User; token: string }>(path, { method: "POST", body: JSON.stringify(body) });
      await SecureStore.setItemAsync(TOKEN_KEY, result.token);
      onLogin(result.user, result.token);
    } catch (requestError) { setError(requestError instanceof Error ? requestError.message : "No se pudo iniciar sesión."); }
  };
  return <SafeAreaView style={styles.authPage}><View style={styles.authPanel}><View style={styles.brandRow}><Text style={styles.brandMark}>WL</Text><Text style={styles.brandName}>Watchlog</Text></View><Text style={styles.kicker}>TU BITÁCORA PERSONAL</Text><Text style={styles.authTitle}>{registering ? "Creá tu cuenta" : "Volvé a tu catálogo"}</Text><Text style={styles.muted}>Guardá lo que viste, tus lecturas y tus partidas en un solo lugar.</Text>{registering ? <TextInput value={name} onChangeText={setName} placeholder="Nombre" placeholderTextColor="#7883aa" style={styles.input} /> : null}<TextInput value={email} onChangeText={setEmail} placeholder="Email" placeholderTextColor="#7883aa" autoCapitalize="none" keyboardType="email-address" style={styles.input} /><TextInput value={password} onChangeText={setPassword} placeholder="Contraseña" placeholderTextColor="#7883aa" secureTextEntry style={styles.input} />{error ? <Text style={styles.error}>{error}</Text> : null}<Pressable style={styles.primaryButton} onPress={submit}><Text style={styles.buttonText}>{registering ? "Crear cuenta" : "Iniciar sesión"}</Text></Pressable><Pressable onPress={() => setRegistering((value) => !value)}><Text style={styles.link}>{registering ? "Ya tengo una cuenta" : "Crear una cuenta nueva"}</Text></Pressable></View></SafeAreaView>;
}

function CustomDrawer({ onLogout, ...props }: DrawerContentComponentProps & { onLogout: () => void }) {
  return <DrawerContentScrollView {...props} contentContainerStyle={styles.drawer}><View style={styles.drawerBrand}><Text style={styles.brandMark}>WL</Text><View><Text style={styles.brandName}>Watchlog</Text><Text style={styles.drawerCaption}>Tu catálogo personal</Text></View></View><DrawerItemList {...props} /><Pressable style={styles.logout} onPress={onLogout}><Text style={styles.logoutText}>Cerrar sesión</Text></Pressable></DrawerContentScrollView>;
}

function Header({ title }: { title: string }) {
  const navigation = useNavigation();
  return <View style={styles.header}>
    <Pressable accessibilityLabel="Abrir menú" hitSlop={12} onPress={() => navigation.dispatch(DrawerActions.toggleDrawer)} style={{ width: 30, height: 30, justifyContent: "center", gap: 5 }}>
      <View style={{ width: 25, height: 3, borderRadius: 2, backgroundColor: "#f4f2ff" }} />
      <View style={{ width: 25, height: 3, borderRadius: 2, backgroundColor: "#f4f2ff" }} />
      <View style={{ width: 25, height: 3, borderRadius: 2, backgroundColor: "#f4f2ff" }} />
    </Pressable>
    <Text style={styles.headerTitle}>{title}</Text>
  </View>;
}

function MovieCard({ movie, action }: { movie: Movie; action?: (status: string) => void }) { return <View style={styles.card}><View style={styles.coverPlaceholder}><Text style={styles.coverText}>{movie.title.slice(0, 1)}</Text></View><View style={styles.cardBody}><Text style={styles.cardTitle} numberOfLines={2}>{movie.title}</Text><Text style={styles.mutedSmall}>{movie.releaseYear ?? "Año desconocido"} · {movie.voteAverage ?? 0}/10</Text><Text style={styles.genreText} numberOfLines={1}>{movie.genres?.join(" · ") || "Sin géneros"}</Text>{action ? <View style={styles.actions}><Pressable onPress={() => action("watched")} style={styles.smallButton}><Text style={styles.smallButtonText}>Vista</Text></Pressable><Pressable onPress={() => action("pending")} style={styles.smallButton}><Text style={styles.smallButtonText}>Pendiente</Text></Pressable><Pressable onPress={() => action("watching")} style={styles.smallButton}><Text style={styles.smallButtonText}>Mirando</Text></Pressable></View> : null}</View></View>; }
function GameCard({ game, action }: { game: Game; action?: (status: string) => void }) { return <View style={styles.card}><View style={[styles.coverPlaceholder, styles.gameCover]}><Text style={styles.coverText}>{game.title.slice(0, 1)}</Text></View><View style={styles.cardBody}><Text style={styles.cardTitle} numberOfLines={2}>{game.title}</Text><Text style={styles.mutedSmall}>{game.releaseYear ?? "Año desconocido"} · {game.rating ?? 0}/5</Text><Text style={styles.genreText} numberOfLines={1}>{game.genres?.join(" · ") || "Sin géneros"}</Text>{action ? <View style={styles.actions}><Pressable onPress={() => action("want")} style={styles.smallButton}><Text style={styles.smallButtonText}>Quiero jugar</Text></Pressable><Pressable onPress={() => action("playing")} style={styles.smallButton}><Text style={styles.smallButtonText}>Jugando</Text></Pressable><Pressable onPress={() => action("completed")} style={styles.smallButton}><Text style={styles.smallButtonText}>Completado</Text></Pressable></View> : null}</View></View>; }
function BookCard({ book, action }: { book: Book; action?: (status: string) => void }) { return <View style={styles.card}><View style={[styles.coverPlaceholder, styles.bookCover]}><Text style={styles.coverText}>{book.title.slice(0, 1)}</Text></View><View style={styles.cardBody}><Text style={styles.cardTitle} numberOfLines={2}>{book.title}</Text><Text style={styles.mutedSmall}>{book.authors?.join(", ") || "Autor desconocido"}</Text><Text style={styles.genreText}>{book.firstPublishYear ?? "Año desconocido"}{book.pageCount ? ` · ${book.pageCount} páginas` : ""}</Text>{action ? <View style={styles.actions}><Pressable onPress={() => action("read")} style={styles.smallButton}><Text style={styles.smallButtonText}>Leído</Text></Pressable><Pressable onPress={() => action("reading")} style={styles.smallButton}><Text style={styles.smallButtonText}>Leyendo</Text></Pressable><Pressable onPress={() => action("pending")} style={styles.smallButton}><Text style={styles.smallButtonText}>Pendiente</Text></Pressable></View> : null}</View></View>; }

function CollectionScreen({ kind, title, status }: { kind: "movie" | "game" | "book"; title: string; status?: string }) {
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => { let active = true; const load = async () => { try { const path = status ? `/api/library/${kind}` : kind === "movie" ? "/api/movies/popular" : kind === "game" ? "/api/games/popular" : "/api/books/recommended"; const result = await api<{ results?: LibraryItem[]; items?: LibraryItem[] }>(path); if (active) setItems(status ? (result.items ?? []).filter((item) => item.status === status) : (result.results ?? []).slice(0, 12)); } catch (requestError) { if (active) setError(requestError instanceof Error ? requestError.message : "No se pudo cargar."); } finally { if (active) setLoading(false); } }; void load(); return () => { active = false; }; }, [kind, status]);
  const search = async () => { if (!query.trim()) return; setLoading(true); try { const path = kind === "movie" ? `/api/movies/search?q=${encodeURIComponent(query)}` : kind === "game" ? `/api/games/search?q=${encodeURIComponent(query)}` : `/api/books/search?q=${encodeURIComponent(query)}`; const result = await api<{ results: LibraryItem[] }>(path); setItems(result.results); } catch (requestError) { setError(requestError instanceof Error ? requestError.message : "No se pudo buscar."); } finally { setLoading(false); } };
  const update = async (item: Movie | Game | Book, nextStatus: string) => { await api(`/api/library/${kind}/${encodeURIComponent(String(item.id))}`, { method: "PUT", body: JSON.stringify({ status: nextStatus, payload: { ...item, status: nextStatus } }) }); setItems((current) => current.filter((entry) => entry.id !== item.id)); };
  return <SafeAreaView style={styles.page}><Header title={title} /><View style={styles.searchRow}><TextInput value={query} onChangeText={setQuery} onSubmitEditing={search} placeholder={`Buscar ${kind === "movie" ? "películas" : kind === "game" ? "videojuegos" : "libros"}...`} placeholderTextColor="#7883aa" style={styles.searchInput} /><Pressable onPress={search} style={styles.searchButton}><Text style={styles.buttonText}>Buscar</Text></Pressable></View>{loading ? <ActivityIndicator color="#8b6cff" style={styles.loader} /> : null}{error ? <Text style={styles.error}>{error}</Text> : null}<FlatList data={items} keyExtractor={(item) => String(item.id)} contentContainerStyle={styles.list} renderItem={({ item }) => kind === "movie" ? <MovieCard movie={item as Movie} action={!status ? (next) => update(item, next) : undefined} /> : kind === "game" ? <GameCard game={item as Game} action={!status ? (next) => update(item, next) : undefined} /> : <BookCard book={item as Book} action={!status ? (next) => update(item, next) : undefined} />} ListEmptyComponent={!loading ? <Text style={styles.muted}>No hay elementos para mostrar.</Text> : null} /></SafeAreaView>;
}

function AppShell({ user, onLogout }: { user: User; onLogout: () => void }) {
  return <Drawer.Navigator drawerContent={(props) => <CustomDrawer {...props} onLogout={onLogout} />} screenOptions={{ headerShown: false, drawerStyle: { backgroundColor: "#11162f", width: 290 }, drawerActiveTintColor: "#ffffff", drawerInactiveTintColor: "#9aa3c7", drawerActiveBackgroundColor: "#2a2158", drawerLabelStyle: { fontSize: 15, marginLeft: -12 } }}><Drawer.Screen name="Movies" options={{ title: "Buscar película o serie" }}>{() => <CollectionScreen kind="movie" title="Películas y series" />}</Drawer.Screen><Drawer.Screen name="Watched" options={{ title: "Vistas" }}>{() => <CollectionScreen kind="movie" title="Vistas" status="watched" />}</Drawer.Screen><Drawer.Screen name="Pending" options={{ title: "Pendientes" }}>{() => <CollectionScreen kind="movie" title="Pendientes" status="pending" />}</Drawer.Screen><Drawer.Screen name="Watching" options={{ title: "Mirando" }}>{() => <CollectionScreen kind="movie" title="Mirando" status="watching" />}</Drawer.Screen><Drawer.Screen name="Games" options={{ title: "Buscar videojuego" }}>{() => <CollectionScreen kind="game" title="Videojuegos" />}</Drawer.Screen><Drawer.Screen name="Books" options={{ title: "Buscar libro" }}>{() => <CollectionScreen kind="book" title="Libros" />}</Drawer.Screen><Drawer.Screen name="Read" options={{ title: "Leídos" }}>{() => <CollectionScreen kind="book" title="Leídos" status="read" />}</Drawer.Screen><Drawer.Screen name="BookPending" options={{ title: "Libros pendientes" }}>{() => <CollectionScreen kind="book" title="Pendientes" status="pending" />}</Drawer.Screen><Drawer.Screen name="Reading" options={{ title: "Leyendo" }}>{() => <CollectionScreen kind="book" title="Leyendo" status="reading" />}</Drawer.Screen></Drawer.Navigator>;
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => { SecureStore.getItemAsync(TOKEN_KEY).then(async (token) => { if (!token) return; try { const result = await api<{ user: User }>("/api/auth/me"); setUser(result.user); } catch { await SecureStore.deleteItemAsync(TOKEN_KEY); } }); }, []);
  if (!user) return <><StatusBar style="light" /><LoginScreen onLogin={(nextUser) => setUser(nextUser)} /></>;
  return <><StatusBar style="light" /><NavigationContainer><AppShell user={user} onLogout={async () => { await api("/api/auth/logout", { method: "POST" }).catch(() => undefined); await SecureStore.deleteItemAsync(TOKEN_KEY); setUser(null); }} /></NavigationContainer></>;
}

const styles = StyleSheet.create({
  authPage: { flex: 1, backgroundColor: "#0c1024", justifyContent: "center", padding: 24 },
  authPanel: { backgroundColor: "#141833", borderColor: "#303866", borderWidth: 1, borderRadius: 24, padding: 24 },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 10 }, brandMark: { backgroundColor: "#8b6cff", color: "#fff", fontWeight: "800", fontSize: 18, padding: 10, borderRadius: 10 }, brandName: { color: "#f4f2ff", fontSize: 18, fontWeight: "800" }, kicker: { color: "#c084fc", fontSize: 12, fontWeight: "700", letterSpacing: 1, marginTop: 28 }, authTitle: { color: "#f4f2ff", fontSize: 32, fontWeight: "800", marginTop: 10 }, muted: { color: "#9aa3c7", lineHeight: 20 }, input: { backgroundColor: "#10152f", borderColor: "#3a4378", borderWidth: 1, borderRadius: 12, color: "#f4f2ff", padding: 14, marginTop: 14 }, primaryButton: { backgroundColor: "#765cf5", borderRadius: 12, padding: 15, alignItems: "center", marginTop: 18 }, buttonText: { color: "#fff", fontWeight: "700" }, link: { color: "#c084fc", marginTop: 18, textAlign: "center" }, error: { color: "#fb7185", marginTop: 12 }, drawer: { flexGrow: 1, paddingTop: 30 }, drawerBrand: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 20, paddingBottom: 28 }, drawerCaption: { color: "#9aa3c7", fontSize: 12, marginTop: 3 }, logout: { marginTop: "auto", borderTopColor: "#2a3160", borderTopWidth: 1, padding: 20 }, logoutText: { color: "#fb7185", fontWeight: "700" }, page: { flex: 1, backgroundColor: "#0c1024" }, header: { flexDirection: "row", alignItems: "center", gap: 16, paddingHorizontal: 18, paddingVertical: 16, backgroundColor: "#141833" }, menuIcon: { color: "#f4f2ff", fontSize: 26 }, headerTitle: { color: "#f4f2ff", fontSize: 22, fontWeight: "800" }, searchRow: { flexDirection: "row", gap: 8, padding: 16 }, searchInput: { flex: 1, backgroundColor: "#141833", borderColor: "#303866", borderWidth: 1, borderRadius: 12, color: "#f4f2ff", paddingHorizontal: 14 }, searchButton: { justifyContent: "center", backgroundColor: "#765cf5", borderRadius: 12, paddingHorizontal: 16 }, loader: { marginTop: 18 }, list: { padding: 16, gap: 14 }, card: { flexDirection: "row", backgroundColor: "#141833", borderRadius: 16, overflow: "hidden", minHeight: 154 }, coverPlaceholder: { width: 100, backgroundColor: "#292052", justifyContent: "center", alignItems: "center" }, gameCover: { backgroundColor: "#3a1622" }, bookCover: { backgroundColor: "#19472f" }, coverText: { color: "#c084fc", fontSize: 38, fontWeight: "800" }, cardBody: { flex: 1, padding: 14, gap: 5 }, cardTitle: { color: "#f4f2ff", fontSize: 16, fontWeight: "800" }, mutedSmall: { color: "#9aa3c7", fontSize: 12 }, genreText: { color: "#72c88c", fontSize: 12 }, actions: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 8 }, smallButton: { borderColor: "#3b4278", borderWidth: 1, borderRadius: 8, paddingVertical: 7, paddingHorizontal: 8 }, smallButtonText: { color: "#f4f2ff", fontSize: 11, fontWeight: "700" },
});
