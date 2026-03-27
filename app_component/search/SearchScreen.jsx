import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useDispatch } from 'react-redux';

import { fetchProducts } from '../../redux/productSlice';
import themes from '../../themes';
import Header from '../home/Header';
import RecentSearches from './RecentSearches';
import SearchProductCard from './SearchProductCard';

const { colors, typography } = themes;
const HISTORY_KEY = 'recentSearches';

const SearchScreen = () => {
    const dispatch = useDispatch();

    const [searchText, setSearchText] = useState('');
    const [recentList, setRecentList] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [hasSearched, setHasSearched] = useState(false); 

    useEffect(() => {
        const loadHistory = async () => {
            try {
                const savedHistory = await AsyncStorage.getItem(HISTORY_KEY);
                if (savedHistory) {
                    setRecentList(JSON.parse(savedHistory));
                }
            } catch (error) {
                console.log('Lỗi khi tải lịch sử:', error);
            }
        };
        loadHistory();
    }, []);

    const saveSearchHistory = async (term) => {
        try {
            const filteredList = recentList.filter((item) => item.toLowerCase() !== term.toLowerCase());
            const newList = [term, ...filteredList].slice(0, 10);
            
            setRecentList(newList);
            await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(newList));
        } catch (error) {
            console.log('Lỗi lưu lịch sử:', error);
        }
    };

    const handleRemoveRecent = async (itemToRemove) => {
        try {
            const newList = recentList.filter((item) => item !== itemToRemove);
            setRecentList(newList);
            await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(newList));
        } catch (error) {
            console.log('Lỗi xóa lịch sử:', error);
        }
    };

    const handlePressRecent = (item) => {
        setSearchText(item);
        executeSearch(item);
    };

    const executeSearch = async (text) => {
        const keyword = text.trim();
        if (!keyword) return;

        saveSearchHistory(keyword);

        setIsSearching(true);
        setHasSearched(true); 
        
        try {
            const response = await dispatch(fetchProducts({ keyword, limit: 20 })).unwrap();
            
            const mappedData = (response.data?.products || response.products || []).map(item => ({
                id: item.id,
                name: item.name,
                price: `${Number(item.unitPrice || 0).toLocaleString('vi-VN')}đ`,
                stock: item.stockQuantity || 0,
                image: item.imageURL || 'https://via.placeholder.com/300x300?text=No+Image'
            }));

            setSearchResults(mappedData);
        } catch (error) {
            setSearchResults([]); 
        } finally {
            setIsSearching(false);
        }
    };

    const handleSearchSubmit = () => {
        executeSearch(searchText);
    };

    const handleChangeText = (text) => {
        setSearchText(text);
        setHasSearched(false); 
        
        if (text.trim().length === 0) {
            setSearchResults([]); 
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            <KeyboardAvoidingView 
                style={styles.keyboardView} 
                behavior={Platform.OS === 'ios' ? 'padding' : null}
            >
                <Header 
                    title="TÌM KIẾM" 
                    onBackPress={() => router.back()} 
                />

                <View style={styles.bodyContent}>
                    <View style={styles.searchBarContainer}>
                        <TextInput
                            style={[typography.subRegular, styles.searchInput]}
                            placeholder="Tìm kiếm"
                            placeholderTextColor={colors.LIGHT}
                            value={searchText}
                            onChangeText={handleChangeText}
                            returnKeyType="search"
                            onSubmitEditing={handleSearchSubmit}
                            autoFocus={true}
                        />
                        <TouchableOpacity style={styles.searchIconBtn} onPress={handleSearchSubmit}>
                            <Feather name="search" size={24} color={colors.BLACK} />
                        </TouchableOpacity>
                    </View>

                    {/* Chuỗi Logic Render hoàn chỉnh */}
                    {isSearching ? (
                        <View style={styles.centerContainer}>
                            <ActivityIndicator size="large" color={colors.MAIN} />
                            <Text style={styles.messageText}>Đang tìm kiếm...</Text>
                        </View>
                    ) : hasSearched && searchResults.length === 0 ? (
                        <View style={styles.centerContainer}>
                            <Feather name="inbox" size={50} color={colors.LIGHT} />
                            <Text style={styles.messageText}>Không tìm thấy sản phẩm nào phù hợp.</Text>
                        </View>
                    ) : searchResults.length > 0 ? (
                        <ScrollView style={styles.resultsContainer} showsVerticalScrollIndicator={false}>
                            <Text style={[typography.subMedium, styles.resultCount]}>
                                Tìm thấy {searchResults.length} kết quả
                            </Text>
                            {searchResults.map((item) => (
                                <SearchProductCard 
                                    key={item.id} 
                                    item={item} 
                                />
                            ))}
                        </ScrollView>
                    ) : recentList.length > 0 ? (
                        <RecentSearches 
                            data={recentList}
                            onRemove={handleRemoveRecent}
                            onItemPress={handlePressRecent}
                        />
                    ) : (
                        /* GIAO DIỆN TRỐNG (EMPTY STATE) KHI CHƯA CÓ GÌ */
                        <View style={styles.centerContainer}>
                            <Feather name="search" size={64} color={colors.NEW} />
                            <Text style={styles.emptyText}>Nhập tên cây cảnh hoặc phụ kiện{'\n'}bạn đang muốn tìm kiếm nhé!</Text>
                        </View>
                    )}
                </View>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.WHITE },
    keyboardView: { flex: 1 },
    bodyContent: { flex: 1 },
    searchBarContainer: {
        flexDirection: 'row', alignItems: 'center', marginHorizontal: 24,
        marginTop: 10, borderBottomWidth: 1, borderBottomColor: colors.BLACK, paddingBottom: 5,
    },
    searchInput: { flex: 1, color: colors.BLACK, height: 40, paddingRight: 10 },
    searchIconBtn: { padding: 5 },
    resultsContainer: { flex: 1, paddingHorizontal: 24, marginTop: 30 },
    resultCount: { color: colors.GRAY, marginBottom: 15 },
    
    // Gom chung style căn giữa cho Loading / Lỗi / Empty State
    centerContainer: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    messageText: { 
        marginTop: 15, 
        color: colors.GRAY,
        textAlign: 'center',
    },
    emptyText: {
        marginTop: 20,
        color: colors.GRAY,
        textAlign: 'center',
        lineHeight: 22,
        fontFamily: 'Poppins-Regular', // Đảm bảo có font chữ nếu bạn dùng
    }
});

export default SearchScreen;