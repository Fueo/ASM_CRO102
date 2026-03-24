import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StatusBar, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import themes from '../../themes';
import Header from '../home/Header';
import SearchProductCard from '../SearchProductCard'; // Import thẻ kết quả tìm kiếm
import RecentSearches from './RecentSearches';

const { colors, typography } = themes;

// Data giả lập chuẩn bị cho API sau này
const DUMMY_RESULTS = [
    { id: '1', name: 'Panse Đen | Hybrid', price: '250.000đ', stock: 156, image: 'https://images.unsplash.com/photo-1596547609652-9fc5d8d42850?q=80&w=200&auto=format&fit=crop' },
    { id: '2', name: 'Spider Plant', price: '250.000đ', stock: 20, image: 'https://images.unsplash.com/photo-1485909645996-33924151433f?q=80&w=200&auto=format&fit=crop' },
];

const SearchScreen = () => {
    const [searchText, setSearchText] = useState('');
    const [recentList, setRecentList] = useState(['Spider Plant', 'Song of India']);
    
    // State lưu trữ kết quả tìm kiếm (Rỗng = chưa tìm kiếm)
    const [searchResults, setSearchResults] = useState([]); 

    const handleRemoveRecent = (itemToRemove) => {
        const newList = recentList.filter(item => item !== itemToRemove);
        setRecentList(newList);
    };

    const handlePressRecent = (item) => {
        setSearchText(item);
        executeSearch(item);
    };

    // Hàm thực thi tìm kiếm (Sau này gọi API ở đây)
    const executeSearch = (text) => {
        console.log('Fetching API với từ khóa:', text);
        
        // Cập nhật lịch sử
        if (!recentList.includes(text)) {
            setRecentList([text, ...recentList]);
        }
        
        // Giả lập set Data từ API
        setSearchResults(DUMMY_RESULTS);
    };

    const handleSearchSubmit = () => {
        const text = searchText.trim();
        if (text.length > 0) {
            executeSearch(text);
        }
    };

    // Theo dõi text input, nếu xóa trắng thì quay lại màn hình lịch sử
    const handleChangeText = (text) => {
        setSearchText(text);
        if (text.length === 0) {
            setSearchResults([]); // Xóa kết quả để hiện lại lịch sử
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
                    {/* Ô nhập liệu Tìm kiếm */}
                    <View style={styles.searchBarContainer}>
                        <TextInput
                            style={[typography.subRegular, styles.searchInput]}
                            placeholder="Tìm kiếm"
                            placeholderTextColor={colors.LIGHT}
                            value={searchText}
                            onChangeText={handleChangeText} // Đã đổi sang hàm mới
                            returnKeyType="search"
                            onSubmitEditing={handleSearchSubmit}
                        />
                        <TouchableOpacity style={styles.searchIconBtn} onPress={handleSearchSubmit}>
                            <Feather name="search" size={24} color={colors.BLACK} />
                        </TouchableOpacity>
                    </View>

                    {/* Logic Render: Nếu có kết quả thì hiện List kết quả, chưa có thì hiện Lịch sử */}
                    {searchResults.length > 0 ? (
                        <ScrollView style={styles.resultsContainer} showsVerticalScrollIndicator={false}>
                            {searchResults.map((item) => (
                                <SearchProductCard 
                                    key={item.id} 
                                    item={item} 
                                />
                            ))}
                        </ScrollView>
                    ) : (
                        <RecentSearches 
                            data={recentList}
                            onRemove={handleRemoveRecent}
                            onItemPress={handlePressRecent}
                        />
                    )}
                </View>

            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.WHITE,
    },
    keyboardView: {
        flex: 1,
    },
    bodyContent: {
        flex: 1,
    },
    searchBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 24,
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.BLACK,
        paddingBottom: 5,
    },
    searchInput: {
        flex: 1,
        color: colors.BLACK,
        height: 40,
        paddingRight: 10,
    },
    searchIconBtn: {
        padding: 5,
    },
    // Style cho vùng chứa danh sách kết quả
    resultsContainer: {
        flex: 1,
        paddingHorizontal: 24,
        marginTop: 30,
    },
});

export default SearchScreen;