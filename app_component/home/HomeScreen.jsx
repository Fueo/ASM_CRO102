import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useMemo } from 'react';
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { fetchHomeData } from '../../redux/productSlice';
import themes from '../../themes';
import ProductList from '../ProductList';

const { colors, typography } = themes;

const ComboCard = ({ title, description, image, onPress }) => {
  return (
    <TouchableOpacity style={styles.comboCardContainer} activeOpacity={0.8} onPress={onPress}>
      <View style={styles.comboTextWrap}>
        <Text style={[typography.subBold, styles.comboTitle]} numberOfLines={1}>
          {title}
        </Text>
        <Text style={[typography.bodyRegular, styles.comboDesc]} numberOfLines={4}>
          {description}
        </Text>
      </View>
      <Image source={{ uri: image }} style={styles.comboImage} />
    </TouchableOpacity>
  );
};

const mapProductsForUI = (products = []) =>
  products.map((item) => ({
    id: item.id,
    name: item.name,
    type: item.stockQuantity ? `Còn ${item.stockQuantity} sản phẩm` : '',
    price: `${Number(item.unitPrice || 0).toLocaleString('vi-VN')}đ`,
    image: item.imageURL || 'https://via.placeholder.com/300x300?text=No+Image',
  }));

const HomeScreen = () => {
  const dispatch = useDispatch();

  const BANNER_IMAGE_URI =
    'https://www.shutterstock.com/image-photo/interior-living-room-monstera-plants-600w-2736506557.jpg';

  const { homeData, homeLoading, homeError } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(fetchHomeData());
  }, [dispatch]);

  const featuredCategories = homeData?.featuredCategories || [];
  const normalCategories = homeData?.categories || [];

  const newArrivalCategory = useMemo(
    () =>
      featuredCategories.find(
        (item) => item?.name?.trim().toLowerCase() === 'hàng mới về'
      ) || null,
    [featuredCategories]
  );

  const comboCategory = useMemo(
    () =>
      featuredCategories.find(
        (item) => item?.name?.trim().toLowerCase() === 'combo chăm sóc'
      ) || null,
    [featuredCategories]
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9F9F9" translucent />

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollContent}>
        <View style={styles.headerWrapper}>
          <View style={styles.headerTop}>
            <View style={styles.headerTextWrap}>
              <Text style={[typography.h1Medium, styles.title]}>Planta - toả sáng</Text>
              <Text style={[typography.h1Medium, styles.title]}>không gian nhà bạn</Text>

              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.newArrivalBtn}
                onPress={() => {
                  if (!newArrivalCategory?.id) return;

                  router.push({
                    pathname: '/category/hang-moi-ve',
                    params: {
                      title: 'HÀNG MỚI VỀ',
                      categoryId: newArrivalCategory.id,
                    },
                  });
                }}
              >
                <Text style={[typography.subMedium, styles.newArrivalText]}>
                  Xem hàng mới về
                </Text>
                <Feather name="arrow-right" size={18} color={colors.MAIN} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.cartBtn}
              onPress={() => {
                router.push('/Cart');
              }}
            >
              <Feather name="shopping-cart" size={20} color={colors.BLACK} />
            </TouchableOpacity>
          </View>

          <View style={styles.bannerContainer}>
            <Image
              source={{ uri: BANNER_IMAGE_URI }}
              style={styles.bannerImage}
              resizeMode="contain"
            />
          </View>
        </View>

        <View style={styles.bodyContent}>
          {homeLoading ? (
            <ActivityIndicator size="large" color={colors.MAIN} style={{ marginTop: 20 }} />
          ) : homeError ? (
            <Text style={styles.errorText}>{homeError}</Text>
          ) : (
            <>
              {newArrivalCategory && (
                <ProductList
                  title={newArrivalCategory.name}
                  cateID={newArrivalCategory.id}
                  data={mapProductsForUI(newArrivalCategory.products)}
                />
              )}

              {normalCategories.map((category) => (
                <ProductList
                  key={category.id}
                  title={category.name}
                  cateID={category.id}
                  data={mapProductsForUI(category.products)}
                />
              ))}

              {comboCategory && (
                <View style={styles.comboSection}>
                  <Text style={[typography.h1Medium, styles.sectionTitle]}>
                    {comboCategory.name}
                  </Text>

                  {comboCategory.products?.map((item) => (
                    <ComboCard
                      key={item.id}
                      title={item.name}
                      description={
                        item.origin
                          ? `Xuất xứ: ${item.origin}${item.size ? ` • Size: ${item.size}` : ''}`
                          : item.size
                          ? `Size: ${item.size}`
                          : `Còn ${item.stockQuantity || 0} sản phẩm`
                      }
                      image={item.imageURL || 'https://via.placeholder.com/300x300?text=No+Image'}
                      onPress={() => router.push(`/product/${item.id}`)}
                    />
                  ))}
                </View>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
  scrollContent: {
    flex: 1,
  },
  headerWrapper: {
    backgroundColor: '#F9F9F9',
    paddingTop: 65,
    paddingBottom: 20,
    zIndex: 1,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    zIndex: 10,
  },
  headerTextWrap: {
    flex: 1,
  },
  title: {
    color: colors.BLACK,
    marginBottom: 4,
  },
  newArrivalBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    gap: 5,
  },
  newArrivalText: {
    color: colors.MAIN,
  },
  cartBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginLeft: 15,
  },
  bannerContainer: {
    height: 140,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    marginTop: -30,
    paddingRight: 10,
  },
  bannerImage: {
    width: '65%',
    height: '100%',
  },
  bodyContent: {
    backgroundColor: colors.WHITE,
    paddingBottom: 20,
  },
  comboSection: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    backgroundColor: colors.WHITE,
    gap: 12,
  },
  sectionTitle: {
    color: colors.BLACK,
    marginBottom: 15,
  },
  comboCardContainer: {
    flexDirection: 'row',
    backgroundColor: colors.NEW,
    borderRadius: 12,
    overflow: 'hidden',
    height: 140,
  },
  comboTextWrap: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  comboTitle: {
    color: colors.BLACK,
    marginBottom: 6,
  },
  comboDesc: {
    color: colors.GRAY,
    lineHeight: 20,
    fontSize: 14,
  },
  comboImage: {
    width: '35%',
    height: '100%',
    resizeMode: 'cover',
  },
  errorText: {
    paddingHorizontal: 24,
    marginTop: 20,
    color: 'red',
  },
});

export default HomeScreen;