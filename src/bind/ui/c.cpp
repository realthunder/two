#include <infra/Api.h>
#include <type/Api.h>
#include <math/Api.h>
#include <ctx/Api.h>
#include <ui/Api.h>

#ifdef MUD_PLATFORM_EMSCRIPTEN
#include <emscripten.h>
#define DECL EMSCRIPTEN_KEEPALIVE
#else
#define DECL
#endif


extern "C" {
	
	// CanvasConnect
	mud::CanvasConnect* DECL mud_CanvasConnect_CanvasConnect_0() {
		return new mud::CanvasConnect();
	}
	void DECL mud_CanvasConnect__destroy(mud::CanvasConnect* self) {
		delete self;
	}
	// Clipboard
	mud::Clipboard* DECL mud_Clipboard_Clipboard_0() {
		return new mud::Clipboard();
	}
	const char* DECL mud_Clipboard__get_text(mud::Clipboard* self) {
		return self->m_text.c_str();
	}
	void DECL mud_Clipboard__set_text(mud::Clipboard* self, const char* value) {
		self->m_text = value;
	}
	bool DECL mud_Clipboard__get_line_mode(mud::Clipboard* self) {
		return self->m_line_mode;
	}
	void DECL mud_Clipboard__set_line_mode(mud::Clipboard* self, bool value) {
		self->m_line_mode = value;
	}
	void DECL mud_Clipboard__destroy(mud::Clipboard* self) {
		delete self;
	}
	// Dock
	mud::Dock* DECL mud_Dock_Dock_0() {
		return new mud::Dock();
	}
	void DECL mud_Dock__destroy(mud::Dock* self) {
		delete self;
	}
	// Docksystem
	void DECL mud_Docksystem__destroy(mud::Docksystem* self) {
		delete self;
	}
	// Gradient
	mud::Gradient* DECL mud_Gradient_Gradient_0() {
		return new mud::Gradient();
	}
	mud::Colour* DECL mud_Gradient__get_start(mud::Gradient* self) {
		static mud::Colour temp;
		return (temp = self->m_start, &temp);
	}
	void DECL mud_Gradient__set_start(mud::Gradient* self, mud::Colour* value) {
		self->m_start = *value;
	}
	mud::Colour* DECL mud_Gradient__get_end(mud::Gradient* self) {
		static mud::Colour temp;
		return (temp = self->m_end, &temp);
	}
	void DECL mud_Gradient__set_end(mud::Gradient* self, mud::Colour* value) {
		self->m_end = *value;
	}
	void DECL mud_Gradient__destroy(mud::Gradient* self) {
		delete self;
	}
	// GridSolver
	void DECL mud_GridSolver__destroy(mud::GridSolver* self) {
		delete self;
	}
	// ImageSkin
	mud::ImageSkin* DECL mud_ImageSkin_ImageSkin_5(mud::Image* image, int left, int top, int right, int bottom) {
		return new mud::ImageSkin(*image, left, top, right, bottom);
	}
	mud::ImageSkin* DECL mud_ImageSkin_ImageSkin_6(mud::Image* image, int left, int top, int right, int bottom, int margin) {
		return new mud::ImageSkin(*image, left, top, right, bottom, margin);
	}
	mud::ImageSkin* DECL mud_ImageSkin_ImageSkin_7(mud::Image* image, int left, int top, int right, int bottom, int margin, mud::Dim stretch) {
		return new mud::ImageSkin(*image, left, top, right, bottom, margin, stretch);
	}
	mud::Image* DECL mud_ImageSkin__get_d_image(mud::ImageSkin* self) {
		return self->d_image;
	}
	void DECL mud_ImageSkin__set_d_image(mud::ImageSkin* self, mud::Image* value) {
		self->d_image = value;
	}
	int DECL mud_ImageSkin__get_d_left(mud::ImageSkin* self) {
		return self->d_left;
	}
	void DECL mud_ImageSkin__set_d_left(mud::ImageSkin* self, int value) {
		self->d_left = value;
	}
	int DECL mud_ImageSkin__get_d_top(mud::ImageSkin* self) {
		return self->d_top;
	}
	void DECL mud_ImageSkin__set_d_top(mud::ImageSkin* self, int value) {
		self->d_top = value;
	}
	int DECL mud_ImageSkin__get_d_right(mud::ImageSkin* self) {
		return self->d_right;
	}
	void DECL mud_ImageSkin__set_d_right(mud::ImageSkin* self, int value) {
		self->d_right = value;
	}
	int DECL mud_ImageSkin__get_d_bottom(mud::ImageSkin* self) {
		return self->d_bottom;
	}
	void DECL mud_ImageSkin__set_d_bottom(mud::ImageSkin* self, int value) {
		self->d_bottom = value;
	}
	int DECL mud_ImageSkin__get_margin(mud::ImageSkin* self) {
		return self->m_margin;
	}
	void DECL mud_ImageSkin__set_margin(mud::ImageSkin* self, int value) {
		self->m_margin = value;
	}
	mud::Dim DECL mud_ImageSkin__get_d_stretch(mud::ImageSkin* self) {
		return self->d_stretch;
	}
	void DECL mud_ImageSkin__set_d_stretch(mud::ImageSkin* self, mud::Dim value) {
		self->d_stretch = value;
	}
	void DECL mud_ImageSkin__destroy(mud::ImageSkin* self) {
		delete self;
	}
	// InkStyle
	mud::InkStyle* DECL mud_InkStyle_InkStyle_0() {
		return new mud::InkStyle();
	}
	mud::InkStyle* DECL mud_InkStyle_InkStyle_1(const char* name) {
		return new mud::InkStyle(name);
	}
	const char* DECL mud_InkStyle__get_name(mud::InkStyle* self) {
		return self->m_name.c_str();
	}
	void DECL mud_InkStyle__set_name(mud::InkStyle* self, const char* value) {
		self->m_name = value;
	}
	bool DECL mud_InkStyle__get_empty(mud::InkStyle* self) {
		return self->m_empty;
	}
	void DECL mud_InkStyle__set_empty(mud::InkStyle* self, bool value) {
		self->m_empty = value;
	}
	mud::Colour* DECL mud_InkStyle__get_background_colour(mud::InkStyle* self) {
		static mud::Colour temp;
		return (temp = self->m_background_colour, &temp);
	}
	void DECL mud_InkStyle__set_background_colour(mud::InkStyle* self, mud::Colour* value) {
		self->m_background_colour = *value;
	}
	mud::Colour* DECL mud_InkStyle__get_border_colour(mud::InkStyle* self) {
		static mud::Colour temp;
		return (temp = self->m_border_colour, &temp);
	}
	void DECL mud_InkStyle__set_border_colour(mud::InkStyle* self, mud::Colour* value) {
		self->m_border_colour = *value;
	}
	mud::Colour* DECL mud_InkStyle__get_image_colour(mud::InkStyle* self) {
		static mud::Colour temp;
		return (temp = self->m_image_colour, &temp);
	}
	void DECL mud_InkStyle__set_image_colour(mud::InkStyle* self, mud::Colour* value) {
		self->m_image_colour = *value;
	}
	mud::Colour* DECL mud_InkStyle__get_text_colour(mud::InkStyle* self) {
		static mud::Colour temp;
		return (temp = self->m_text_colour, &temp);
	}
	void DECL mud_InkStyle__set_text_colour(mud::InkStyle* self, mud::Colour* value) {
		self->m_text_colour = *value;
	}
	const char* DECL mud_InkStyle__get_text_font(mud::InkStyle* self) {
		return self->m_text_font.c_str();
	}
	void DECL mud_InkStyle__set_text_font(mud::InkStyle* self, const char* value) {
		self->m_text_font = value;
	}
	float DECL mud_InkStyle__get_text_size(mud::InkStyle* self) {
		return self->m_text_size;
	}
	void DECL mud_InkStyle__set_text_size(mud::InkStyle* self, float value) {
		self->m_text_size = value;
	}
	bool DECL mud_InkStyle__get_text_break(mud::InkStyle* self) {
		return self->m_text_break;
	}
	void DECL mud_InkStyle__set_text_break(mud::InkStyle* self, bool value) {
		self->m_text_break = value;
	}
	bool DECL mud_InkStyle__get_text_wrap(mud::InkStyle* self) {
		return self->m_text_wrap;
	}
	void DECL mud_InkStyle__set_text_wrap(mud::InkStyle* self, bool value) {
		self->m_text_wrap = value;
	}
	mud::vec4* DECL mud_InkStyle__get_border_width(mud::InkStyle* self) {
		static mud::vec4 temp;
		return (temp = self->m_border_width, &temp);
	}
	void DECL mud_InkStyle__set_border_width(mud::InkStyle* self, mud::vec4* value) {
		self->m_border_width = *value;
	}
	mud::vec4* DECL mud_InkStyle__get_corner_radius(mud::InkStyle* self) {
		static mud::vec4 temp;
		return (temp = self->m_corner_radius, &temp);
	}
	void DECL mud_InkStyle__set_corner_radius(mud::InkStyle* self, mud::vec4* value) {
		self->m_corner_radius = *value;
	}
	bool DECL mud_InkStyle__get_weak_corners(mud::InkStyle* self) {
		return self->m_weak_corners;
	}
	void DECL mud_InkStyle__set_weak_corners(mud::InkStyle* self, bool value) {
		self->m_weak_corners = value;
	}
	mud::vec4* DECL mud_InkStyle__get_padding(mud::InkStyle* self) {
		static mud::vec4 temp;
		return (temp = self->m_padding, &temp);
	}
	void DECL mud_InkStyle__set_padding(mud::InkStyle* self, mud::vec4* value) {
		self->m_padding = *value;
	}
	mud::vec4* DECL mud_InkStyle__get_margin(mud::InkStyle* self) {
		static mud::vec4 temp;
		return (temp = self->m_margin, &temp);
	}
	void DECL mud_InkStyle__set_margin(mud::InkStyle* self, mud::vec4* value) {
		self->m_margin = *value;
	}
	mud::vec2* DECL mud_InkStyle__get_linear_gradient(mud::InkStyle* self) {
		static mud::vec2 temp;
		return (temp = self->m_linear_gradient, &temp);
	}
	void DECL mud_InkStyle__set_linear_gradient(mud::InkStyle* self, mud::vec2* value) {
		self->m_linear_gradient = *value;
	}
	mud::Dim DECL mud_InkStyle__get_linear_gradient_dim(mud::InkStyle* self) {
		return self->m_linear_gradient_dim;
	}
	void DECL mud_InkStyle__set_linear_gradient_dim(mud::InkStyle* self, mud::Dim value) {
		self->m_linear_gradient_dim = value;
	}
	mud::Image* DECL mud_InkStyle__get_image(mud::InkStyle* self) {
		return self->m_image;
	}
	void DECL mud_InkStyle__set_image(mud::InkStyle* self, mud::Image* value) {
		self->m_image = value;
	}
	mud::Image* DECL mud_InkStyle__get_overlay(mud::InkStyle* self) {
		return self->m_overlay;
	}
	void DECL mud_InkStyle__set_overlay(mud::InkStyle* self, mud::Image* value) {
		self->m_overlay = value;
	}
	mud::Image* DECL mud_InkStyle__get_tile(mud::InkStyle* self) {
		return self->m_tile;
	}
	void DECL mud_InkStyle__set_tile(mud::InkStyle* self, mud::Image* value) {
		self->m_tile = value;
	}
	mud::ImageSkin* DECL mud_InkStyle__get_image_skin(mud::InkStyle* self) {
		static mud::ImageSkin temp;
		return (temp = self->m_image_skin, &temp);
	}
	void DECL mud_InkStyle__set_image_skin(mud::InkStyle* self, mud::ImageSkin* value) {
		self->m_image_skin = *value;
	}
	mud::Shadow* DECL mud_InkStyle__get_shadow(mud::InkStyle* self) {
		static mud::Shadow temp;
		return (temp = self->m_shadow, &temp);
	}
	void DECL mud_InkStyle__set_shadow(mud::InkStyle* self, mud::Shadow* value) {
		self->m_shadow = *value;
	}
	mud::Colour* DECL mud_InkStyle__get_shadow_colour(mud::InkStyle* self) {
		static mud::Colour temp;
		return (temp = self->m_shadow_colour, &temp);
	}
	void DECL mud_InkStyle__set_shadow_colour(mud::InkStyle* self, mud::Colour* value) {
		self->m_shadow_colour = *value;
	}
	mud::Style* DECL mud_InkStyle__get_hover_cursor(mud::InkStyle* self) {
		return self->m_hover_cursor;
	}
	void DECL mud_InkStyle__set_hover_cursor(mud::InkStyle* self, mud::Style* value) {
		self->m_hover_cursor = value;
	}
	void DECL mud_InkStyle__destroy(mud::InkStyle* self) {
		delete self;
	}
	// Layer
	void DECL mud_Layer__destroy(mud::Layer* self) {
		delete self;
	}
	// Layout
	mud::Layout* DECL mud_Layout_Layout_0() {
		return new mud::Layout();
	}
	mud::Layout* DECL mud_Layout_Layout_1(const char* name) {
		return new mud::Layout(name);
	}
	const char* DECL mud_Layout__get_name(mud::Layout* self) {
		return self->m_name.c_str();
	}
	void DECL mud_Layout__set_name(mud::Layout* self, const char* value) {
		self->m_name = value;
	}
	mud::LayoutSolver DECL mud_Layout__get_solver(mud::Layout* self) {
		return self->m_solver;
	}
	void DECL mud_Layout__set_solver(mud::Layout* self, mud::LayoutSolver value) {
		self->m_solver = value;
	}
	mud::Flow DECL mud_Layout__get_flow(mud::Layout* self) {
		return self->m_flow;
	}
	void DECL mud_Layout__set_flow(mud::Layout* self, mud::Flow value) {
		self->m_flow = value;
	}
	mud::Space* DECL mud_Layout__get_space(mud::Layout* self) {
		static mud::Space temp;
		return (temp = self->m_space, &temp);
	}
	void DECL mud_Layout__set_space(mud::Layout* self, mud::Space* value) {
		self->m_space = *value;
	}
	mud::Clipping DECL mud_Layout__get_clipping(mud::Layout* self) {
		return self->m_clipping;
	}
	void DECL mud_Layout__set_clipping(mud::Layout* self, mud::Clipping value) {
		self->m_clipping = value;
	}
	mud::Opacity DECL mud_Layout__get_opacity(mud::Layout* self) {
		return self->m_opacity;
	}
	void DECL mud_Layout__set_opacity(mud::Layout* self, mud::Opacity value) {
		self->m_opacity = value;
	}
	mud::vec2* DECL mud_Layout__get_span(mud::Layout* self) {
		static mud::vec2 temp;
		return (temp = self->m_span, &temp);
	}
	void DECL mud_Layout__set_span(mud::Layout* self, mud::vec2* value) {
		self->m_span = *value;
	}
	mud::vec2* DECL mud_Layout__get_size(mud::Layout* self) {
		static mud::vec2 temp;
		return (temp = self->m_size, &temp);
	}
	void DECL mud_Layout__set_size(mud::Layout* self, mud::vec2* value) {
		self->m_size = *value;
	}
	mud::vec4* DECL mud_Layout__get_padding(mud::Layout* self) {
		static mud::vec4 temp;
		return (temp = self->m_padding, &temp);
	}
	void DECL mud_Layout__set_padding(mud::Layout* self, mud::vec4* value) {
		self->m_padding = *value;
	}
	mud::vec2* DECL mud_Layout__get_margin(mud::Layout* self) {
		static mud::vec2 temp;
		return (temp = self->m_margin, &temp);
	}
	void DECL mud_Layout__set_margin(mud::Layout* self, mud::vec2* value) {
		self->m_margin = *value;
	}
	mud::vec2* DECL mud_Layout__get_spacing(mud::Layout* self) {
		static mud::vec2 temp;
		return (temp = self->m_spacing, &temp);
	}
	void DECL mud_Layout__set_spacing(mud::Layout* self, mud::vec2* value) {
		self->m_spacing = *value;
	}
	int DECL mud_Layout__get_zorder(mud::Layout* self) {
		return self->m_zorder;
	}
	void DECL mud_Layout__set_zorder(mud::Layout* self, int value) {
		self->m_zorder = value;
	}
	bool DECL mud_Layout__get_no_grid(mud::Layout* self) {
		return self->m_no_grid;
	}
	void DECL mud_Layout__set_no_grid(mud::Layout* self, bool value) {
		self->m_no_grid = value;
	}
	size_t DECL mud_Layout__get_updated(mud::Layout* self) {
		return self->m_updated;
	}
	void DECL mud_Layout__set_updated(mud::Layout* self, size_t value) {
		self->m_updated = value;
	}
	void DECL mud_Layout__destroy(mud::Layout* self) {
		delete self;
	}
	// NodeConnection
	mud::NodeConnection* DECL mud_NodeConnection_NodeConnection_0() {
		return new mud::NodeConnection();
	}
	void DECL mud_NodeConnection__destroy(mud::NodeConnection* self) {
		delete self;
	}
	// Paint
	mud::Paint* DECL mud_Paint_Paint_0() {
		return new mud::Paint();
	}
	mud::Colour* DECL mud_Paint__get_fill_colour(mud::Paint* self) {
		static mud::Colour temp;
		return (temp = self->m_fill_colour, &temp);
	}
	void DECL mud_Paint__set_fill_colour(mud::Paint* self, mud::Colour* value) {
		self->m_fill_colour = *value;
	}
	mud::Colour* DECL mud_Paint__get_stroke_colour(mud::Paint* self) {
		static mud::Colour temp;
		return (temp = self->m_stroke_colour, &temp);
	}
	void DECL mud_Paint__set_stroke_colour(mud::Paint* self, mud::Colour* value) {
		self->m_stroke_colour = *value;
	}
	float DECL mud_Paint__get_stroke_width(mud::Paint* self) {
		return self->m_stroke_width;
	}
	void DECL mud_Paint__set_stroke_width(mud::Paint* self, float value) {
		self->m_stroke_width = value;
	}
	void DECL mud_Paint__destroy(mud::Paint* self) {
		delete self;
	}
	// Shadow
	mud::Shadow* DECL mud_Shadow_Shadow_4(float xpos, float ypos, float blur, float spread) {
		return new mud::Shadow(xpos, ypos, blur, spread);
	}
	mud::Shadow* DECL mud_Shadow_Shadow_5(float xpos, float ypos, float blur, float spread, mud::Colour* colour) {
		return new mud::Shadow(xpos, ypos, blur, spread, *colour);
	}
	float DECL mud_Shadow__get_d_xpos(mud::Shadow* self) {
		return self->d_xpos;
	}
	void DECL mud_Shadow__set_d_xpos(mud::Shadow* self, float value) {
		self->d_xpos = value;
	}
	float DECL mud_Shadow__get_d_ypos(mud::Shadow* self) {
		return self->d_ypos;
	}
	void DECL mud_Shadow__set_d_ypos(mud::Shadow* self, float value) {
		self->d_ypos = value;
	}
	float DECL mud_Shadow__get_d_blur(mud::Shadow* self) {
		return self->d_blur;
	}
	void DECL mud_Shadow__set_d_blur(mud::Shadow* self, float value) {
		self->d_blur = value;
	}
	float DECL mud_Shadow__get_d_spread(mud::Shadow* self) {
		return self->d_spread;
	}
	void DECL mud_Shadow__set_d_spread(mud::Shadow* self, float value) {
		self->d_spread = value;
	}
	mud::Colour* DECL mud_Shadow__get_d_colour(mud::Shadow* self) {
		static mud::Colour temp;
		return (temp = self->d_colour, &temp);
	}
	void DECL mud_Shadow__set_d_colour(mud::Shadow* self, mud::Colour* value) {
		self->d_colour = *value;
	}
	void DECL mud_Shadow__destroy(mud::Shadow* self) {
		delete self;
	}
	// Space
	mud::Space* DECL mud_Space_Space_0() {
		return new mud::Space();
	}
	mud::FlowAxis DECL mud_Space__get_direction(mud::Space* self) {
		return self->direction;
	}
	void DECL mud_Space__set_direction(mud::Space* self, mud::FlowAxis value) {
		self->direction = value;
	}
	mud::Sizing DECL mud_Space__get_sizingLength(mud::Space* self) {
		return self->sizingLength;
	}
	void DECL mud_Space__set_sizingLength(mud::Space* self, mud::Sizing value) {
		self->sizingLength = value;
	}
	mud::Sizing DECL mud_Space__get_sizingDepth(mud::Space* self) {
		return self->sizingDepth;
	}
	void DECL mud_Space__set_sizingDepth(mud::Space* self, mud::Sizing value) {
		self->sizingDepth = value;
	}
	void DECL mud_Space__destroy(mud::Space* self) {
		delete self;
	}
	// Style
	mud::Style* DECL mud_Style__get_base(mud::Style* self) {
		return self->m_base;
	}
	void DECL mud_Style__set_base(mud::Style* self, mud::Style* value) {
		self->m_base = value;
	}
	const char* DECL mud_Style__get_name(mud::Style* self) {
		return self->name();
	}
	mud::Layout* DECL mud_Style__get_layout(mud::Style* self) {
		return &self->layout();
	}
	mud::InkStyle* DECL mud_Style__get_skin(mud::Style* self) {
		return &self->skin();
	}
	void DECL mud_Style__destroy(mud::Style* self) {
		delete self;
	}
	// TableSolver
	void DECL mud_TableSolver__destroy(mud::TableSolver* self) {
		delete self;
	}
	// Text
	void DECL mud_Text__destroy(mud::Text* self) {
		delete self;
	}
	// TextCursor
	mud::TextCursor* DECL mud_TextCursor_TextCursor_0() {
		return new mud::TextCursor();
	}
	void DECL mud_TextCursor__destroy(mud::TextCursor* self) {
		delete self;
	}
	// TextMarker
	mud::TextMarker* DECL mud_TextMarker_TextMarker_0() {
		return new mud::TextMarker();
	}
	void DECL mud_TextMarker__destroy(mud::TextMarker* self) {
		delete self;
	}
	// TextPaint
	mud::TextPaint* DECL mud_TextPaint_TextPaint_0() {
		return new mud::TextPaint();
	}
	const char* DECL mud_TextPaint__get_font(mud::TextPaint* self) {
		return self->m_font;
	}
	void DECL mud_TextPaint__set_font(mud::TextPaint* self, const char* value) {
		self->m_font = value;
	}
	mud::Colour* DECL mud_TextPaint__get_colour(mud::TextPaint* self) {
		static mud::Colour temp;
		return (temp = self->m_colour, &temp);
	}
	void DECL mud_TextPaint__set_colour(mud::TextPaint* self, mud::Colour* value) {
		self->m_colour = *value;
	}
	float DECL mud_TextPaint__get_size(mud::TextPaint* self) {
		return self->m_size;
	}
	void DECL mud_TextPaint__set_size(mud::TextPaint* self, float value) {
		self->m_size = value;
	}
	bool DECL mud_TextPaint__get_text_break(mud::TextPaint* self) {
		return self->m_text_break;
	}
	void DECL mud_TextPaint__set_text_break(mud::TextPaint* self, bool value) {
		self->m_text_break = value;
	}
	bool DECL mud_TextPaint__get_text_wrap(mud::TextPaint* self) {
		return self->m_text_wrap;
	}
	void DECL mud_TextPaint__set_text_wrap(mud::TextPaint* self, bool value) {
		self->m_text_wrap = value;
	}
	void DECL mud_TextPaint__destroy(mud::TextPaint* self) {
		delete self;
	}
	// TextSelection
	mud::TextSelection* DECL mud_TextSelection_TextSelection_0() {
		return new mud::TextSelection();
	}
	void DECL mud_TextSelection__destroy(mud::TextSelection* self) {
		delete self;
	}
	// UiRect
	mud::UiRect* DECL mud_UiRect_UiRect_0() {
		return new mud::UiRect();
	}
	mud::vec2* DECL mud_UiRect__get_position(mud::UiRect* self) {
		static mud::vec2 temp;
		return (temp = self->m_position, &temp);
	}
	void DECL mud_UiRect__set_position(mud::UiRect* self, mud::vec2* value) {
		self->m_position = *value;
	}
	mud::vec2* DECL mud_UiRect__get_size(mud::UiRect* self) {
		static mud::vec2 temp;
		return (temp = self->m_size, &temp);
	}
	void DECL mud_UiRect__set_size(mud::UiRect* self, mud::vec2* value) {
		self->m_size = *value;
	}
	mud::vec2* DECL mud_UiRect__get_content(mud::UiRect* self) {
		static mud::vec2 temp;
		return (temp = self->m_content, &temp);
	}
	void DECL mud_UiRect__set_content(mud::UiRect* self, mud::vec2* value) {
		self->m_content = *value;
	}
	mud::vec2* DECL mud_UiRect__get_span(mud::UiRect* self) {
		static mud::vec2 temp;
		return (temp = self->m_span, &temp);
	}
	void DECL mud_UiRect__set_span(mud::UiRect* self, mud::vec2* value) {
		self->m_span = *value;
	}
	float DECL mud_UiRect__get_scale(mud::UiRect* self) {
		return self->m_scale;
	}
	void DECL mud_UiRect__set_scale(mud::UiRect* self, float value) {
		self->m_scale = value;
	}
	void DECL mud_UiRect__destroy(mud::UiRect* self) {
		delete self;
	}
	// UiWindow
	void DECL mud_UiWindow__destroy(mud::UiWindow* self) {
		delete self;
	}
	// User
	void DECL mud_User__destroy(mud::User* self) {
		delete self;
	}
	// Vg
	void DECL mud_Vg__destroy(mud::Vg* self) {
		delete self;
	}
	// Frame
	void DECL mud_Frame__destroy(mud::Frame* self) {
		delete self;
	}
	// FrameSolver
	void DECL mud_FrameSolver__destroy(mud::FrameSolver* self) {
		delete self;
	}
	// LineSolver
	void DECL mud_LineSolver__destroy(mud::LineSolver* self) {
		delete self;
	}
	// Widget
	bool DECL mud_Widget_activated_0(mud::Widget* self) {
		return self->activated();
	}
	mud::KeyEvent* DECL mud_Widget_char_stroke_1(mud::Widget* self, mud::Key code) {
		static mud::KeyEvent temp;
		return (temp = self->char_stroke(code), &temp);
	}
	mud::KeyEvent* DECL mud_Widget_char_stroke_2(mud::Widget* self, mud::Key code, mud::InputMod modifier) {
		static mud::KeyEvent temp;
		return (temp = self->char_stroke(code, modifier), &temp);
	}
	void DECL mud_Widget_clear_focus_0(mud::Widget* self) {
		self->clear_focus();
	}
	bool DECL mud_Widget_closed_0(mud::Widget* self) {
		return self->closed();
	}
	void DECL mud_Widget_disable_state_1(mud::Widget* self, mud::WidgetState state) {
		self->disable_state(state);
	}
	void DECL mud_Widget_enable_state_1(mud::Widget* self, mud::WidgetState state) {
		self->enable_state(state);
	}
	bool DECL mud_Widget_focused_0(mud::Widget* self) {
		return self->focused();
	}
	bool DECL mud_Widget_hovered_0(mud::Widget* self) {
		return self->hovered();
	}
	mud::KeyEvent* DECL mud_Widget_key_event_2(mud::Widget* self, mud::Key code, mud::EventType event_type) {
		static mud::KeyEvent temp;
		return (temp = self->key_event(code, event_type), &temp);
	}
	mud::KeyEvent* DECL mud_Widget_key_event_3(mud::Widget* self, mud::Key code, mud::EventType event_type, mud::InputMod modifier) {
		static mud::KeyEvent temp;
		return (temp = self->key_event(code, event_type, modifier), &temp);
	}
	mud::KeyEvent* DECL mud_Widget_key_stroke_1(mud::Widget* self, mud::Key code) {
		static mud::KeyEvent temp;
		return (temp = self->key_stroke(code), &temp);
	}
	mud::KeyEvent* DECL mud_Widget_key_stroke_2(mud::Widget* self, mud::Key code, mud::InputMod modifier) {
		static mud::KeyEvent temp;
		return (temp = self->key_stroke(code, modifier), &temp);
	}
	bool DECL mud_Widget_modal_0(mud::Widget* self) {
		return self->modal();
	}
	mud::MouseEvent* DECL mud_Widget_mouse_event_2(mud::Widget* self, mud::DeviceType device, mud::EventType event_type) {
		static mud::MouseEvent temp;
		return (temp = self->mouse_event(device, event_type), &temp);
	}
	mud::MouseEvent* DECL mud_Widget_mouse_event_3(mud::Widget* self, mud::DeviceType device, mud::EventType event_type, mud::InputMod modifier) {
		static mud::MouseEvent temp;
		return (temp = self->mouse_event(device, event_type, modifier), &temp);
	}
	mud::MouseEvent* DECL mud_Widget_mouse_event_4(mud::Widget* self, mud::DeviceType device, mud::EventType event_type, mud::InputMod modifier, bool consume) {
		static mud::MouseEvent temp;
		return (temp = self->mouse_event(device, event_type, modifier, consume), &temp);
	}
	mud::Widget* DECL mud_Widget_parent_modal_0(mud::Widget* self) {
		return &self->parent_modal();
	}
	bool DECL mud_Widget_pressed_0(mud::Widget* self) {
		return self->pressed();
	}
	bool DECL mud_Widget_selected_0(mud::Widget* self) {
		return self->selected();
	}
	void DECL mud_Widget_set_state_2(mud::Widget* self, mud::WidgetState state, bool enabled) {
		self->set_state(state, enabled);
	}
	void DECL mud_Widget_take_focus_0(mud::Widget* self) {
		self->take_focus();
	}
	void DECL mud_Widget_take_modal_1(mud::Widget* self, uint32_t device_filter) {
		self->take_modal(device_filter);
	}
	void DECL mud_Widget_toggle_state_1(mud::Widget* self, mud::WidgetState state) {
		self->toggle_state(state);
	}
	mud::Ui* DECL mud_Widget_ui_0(mud::Widget* self) {
		return &self->ui();
	}
	mud::UiWindow* DECL mud_Widget_ui_window_0(mud::Widget* self) {
		return &self->ui_window();
	}
	void DECL mud_Widget_yield_focus_0(mud::Widget* self) {
		self->yield_focus();
	}
	void DECL mud_Widget_yield_modal_0(mud::Widget* self) {
		self->yield_modal();
	}
	mud::Frame* DECL mud_Widget__get_frame(mud::Widget* self) {
		return &self->m_frame;
	}
	mud::WidgetState DECL mud_Widget__get_state(mud::Widget* self) {
		return self->m_state;
	}
	void DECL mud_Widget__set_state(mud::Widget* self, mud::WidgetState value) {
		self->m_state = value;
	}
	uint32_t DECL mud_Widget__get_switch(mud::Widget* self) {
		return self->m_switch;
	}
	void DECL mud_Widget__set_switch(mud::Widget* self, uint32_t value) {
		self->m_switch = value;
	}
	size_t DECL mud_Widget__get_index(mud::Widget* self) {
		return self->m_index;
	}
	void DECL mud_Widget__set_index(mud::Widget* self, size_t value) {
		self->m_index = value;
	}
	bool DECL mud_Widget__get_open(mud::Widget* self) {
		return self->m_open;
	}
	void DECL mud_Widget__set_open(mud::Widget* self, bool value) {
		self->m_open = value;
	}
	mud::Widget* DECL mud_Widget__get_body(mud::Widget* self) {
		return self->m_body;
	}
	void DECL mud_Widget__set_body(mud::Widget* self, mud::Widget* value) {
		self->m_body = value;
	}
	void DECL mud_Widget__destroy(mud::Widget* self) {
		delete self;
	}
	// Canvas
	void DECL mud_Canvas__destroy(mud::Canvas* self) {
		delete self;
	}
	// Dockable
	void DECL mud_Dockable__destroy(mud::Dockable* self) {
		delete self;
	}
	// Docker
	void DECL mud_Docker__destroy(mud::Docker* self) {
		delete self;
	}
	// Dockbar
	void DECL mud_Dockbar__destroy(mud::Dockbar* self) {
		delete self;
	}
	// Dockspace
	void DECL mud_Dockspace__destroy(mud::Dockspace* self) {
		delete self;
	}
	// Expandbox
	void DECL mud_Expandbox__destroy(mud::Expandbox* self) {
		delete self;
	}
	// Node
	void DECL mud_Node__destroy(mud::Node* self) {
		delete self;
	}
	// NodePlug
	void DECL mud_NodePlug__destroy(mud::NodePlug* self) {
		delete self;
	}
	// RowSolver
	void DECL mud_RowSolver__destroy(mud::RowSolver* self) {
		delete self;
	}
	// ScrollSheet
	void DECL mud_ScrollSheet__destroy(mud::ScrollSheet* self) {
		delete self;
	}
	// Sequence
	void DECL mud_ui_Sequence__destroy(mud::ui::Sequence* self) {
		delete self;
	}
	// Tabber
	void DECL mud_Tabber__destroy(mud::Tabber* self) {
		delete self;
	}
	// Table
	void DECL mud_Table__destroy(mud::Table* self) {
		delete self;
	}
	// TextEdit
	void DECL mud_TextEdit__destroy(mud::TextEdit* self) {
		delete self;
	}
	// TreeNode
	void DECL mud_TreeNode__destroy(mud::TreeNode* self) {
		delete self;
	}
	// Ui
	mud::Widget* DECL mud_Ui_begin_0(mud::Ui* self) {
		return &self->begin();
	}
	void DECL mud_Ui__destroy(mud::Ui* self) {
		delete self;
	}
	// Window
	void DECL mud_Window__destroy(mud::Window* self) {
		delete self;
	}
	// Align
	mud::Align DECL mud_Align_Left() {
		return mud::Left;
	}
	mud::Align DECL mud_Align_CENTER() {
		return mud::CENTER;
	}
	mud::Align DECL mud_Align_Right() {
		return mud::Right;
	}
	mud::Align DECL mud_Align_OUT_LEFT() {
		return mud::OUT_LEFT;
	}
	mud::Align DECL mud_Align_OUT_RIGHT() {
		return mud::OUT_RIGHT;
	}
	// AutoLayout
	mud::AutoLayout DECL mud_AutoLayout_NO_LAYOUT() {
		return mud::NO_LAYOUT;
	}
	mud::AutoLayout DECL mud_AutoLayout_AUTO_SIZE() {
		return mud::AUTO_SIZE;
	}
	mud::AutoLayout DECL mud_AutoLayout_AUTO_LAYOUT() {
		return mud::AUTO_LAYOUT;
	}
	// Clipping
	mud::Clipping DECL mud_Clipping_NOCLIP() {
		return mud::NOCLIP;
	}
	mud::Clipping DECL mud_Clipping_CLIP() {
		return mud::CLIP;
	}
	mud::Clipping DECL mud_Clipping_UNCLIP() {
		return mud::UNCLIP;
	}
	// Dim
	mud::Dim DECL mud_Dim_DIM_X() {
		return mud::DIM_X;
	}
	mud::Dim DECL mud_Dim_DIM_Y() {
		return mud::DIM_Y;
	}
	mud::Dim DECL mud_Dim_DIM_NONE() {
		return mud::DIM_NONE;
	}
	// Flow
	mud::Flow DECL mud_Flow_FLOW() {
		return mud::FLOW;
	}
	mud::Flow DECL mud_Flow_OVERLAY() {
		return mud::OVERLAY;
	}
	mud::Flow DECL mud_Flow_ALIGN() {
		return mud::ALIGN;
	}
	mud::Flow DECL mud_Flow_FREE() {
		return mud::FREE;
	}
	// FlowAxis
	mud::FlowAxis DECL mud_FlowAxis_READING() {
		return mud::READING;
	}
	mud::FlowAxis DECL mud_FlowAxis_PARAGRAPH() {
		return mud::PARAGRAPH;
	}
	mud::FlowAxis DECL mud_FlowAxis_PARALLEL() {
		return mud::PARALLEL;
	}
	mud::FlowAxis DECL mud_FlowAxis_ORTHOGONAL() {
		return mud::ORTHOGONAL;
	}
	mud::FlowAxis DECL mud_FlowAxis_AXIS_NONE() {
		return mud::AXIS_NONE;
	}
	// LayoutSolver
	mud::LayoutSolver DECL mud_LayoutSolver_FRAME_SOLVER() {
		return mud::FRAME_SOLVER;
	}
	mud::LayoutSolver DECL mud_LayoutSolver_ROW_SOLVER() {
		return mud::ROW_SOLVER;
	}
	mud::LayoutSolver DECL mud_LayoutSolver_GRID_SOLVER() {
		return mud::GRID_SOLVER;
	}
	mud::LayoutSolver DECL mud_LayoutSolver_TABLE_SOLVER() {
		return mud::TABLE_SOLVER;
	}
	// Opacity
	mud::Opacity DECL mud_Opacity_OPAQUE() {
		return mud::OPAQUE;
	}
	mud::Opacity DECL mud_Opacity_CLEAR() {
		return mud::CLEAR;
	}
	mud::Opacity DECL mud_Opacity_HOLLOW() {
		return mud::HOLLOW;
	}
	// Pivot
	mud::Pivot DECL mud_Pivot_FORWARD() {
		return mud::FORWARD;
	}
	mud::Pivot DECL mud_Pivot_REVERSE() {
		return mud::REVERSE;
	}
	// PopupFlags
	mud::ui::PopupFlags DECL mud_ui_PopupFlags_None() {
		return mud::ui::PopupFlags::None;
	}
	mud::ui::PopupFlags DECL mud_ui_PopupFlags_Modal() {
		return mud::ui::PopupFlags::Modal;
	}
	mud::ui::PopupFlags DECL mud_ui_PopupFlags_Clamp() {
		return mud::ui::PopupFlags::Clamp;
	}
	mud::ui::PopupFlags DECL mud_ui_PopupFlags_AutoClose() {
		return mud::ui::PopupFlags::AutoClose;
	}
	mud::ui::PopupFlags DECL mud_ui_PopupFlags_AutoModal() {
		return mud::ui::PopupFlags::AutoModal;
	}
	// Sizing
	mud::Sizing DECL mud_Sizing_FIXED() {
		return mud::FIXED;
	}
	mud::Sizing DECL mud_Sizing_SHRINK() {
		return mud::SHRINK;
	}
	mud::Sizing DECL mud_Sizing_WRAP() {
		return mud::WRAP;
	}
	mud::Sizing DECL mud_Sizing_EXPAND() {
		return mud::EXPAND;
	}
	// SpacePreset
	mud::SpacePreset DECL mud_SpacePreset_SHEET() {
		return mud::SHEET;
	}
	mud::SpacePreset DECL mud_SpacePreset_FLEX() {
		return mud::FLEX;
	}
	mud::SpacePreset DECL mud_SpacePreset_ITEM() {
		return mud::ITEM;
	}
	mud::SpacePreset DECL mud_SpacePreset_UNIT() {
		return mud::UNIT;
	}
	mud::SpacePreset DECL mud_SpacePreset_BLOCK() {
		return mud::BLOCK;
	}
	mud::SpacePreset DECL mud_SpacePreset_LINE() {
		return mud::LINE;
	}
	mud::SpacePreset DECL mud_SpacePreset_STACK() {
		return mud::STACK;
	}
	mud::SpacePreset DECL mud_SpacePreset_DIV() {
		return mud::DIV;
	}
	mud::SpacePreset DECL mud_SpacePreset_SPACER() {
		return mud::SPACER;
	}
	mud::SpacePreset DECL mud_SpacePreset_BOARD() {
		return mud::BOARD;
	}
	mud::SpacePreset DECL mud_SpacePreset_LAYOUT() {
		return mud::LAYOUT;
	}
	// WidgetState
	mud::WidgetState DECL mud_WidgetState_NOSTATE() {
		return mud::NOSTATE;
	}
	mud::WidgetState DECL mud_WidgetState_CREATED() {
		return mud::CREATED;
	}
	mud::WidgetState DECL mud_WidgetState_HOVERED() {
		return mud::HOVERED;
	}
	mud::WidgetState DECL mud_WidgetState_PRESSED() {
		return mud::PRESSED;
	}
	mud::WidgetState DECL mud_WidgetState_ACTIVATED() {
		return mud::ACTIVATED;
	}
	mud::WidgetState DECL mud_WidgetState_ACTIVE() {
		return mud::ACTIVE;
	}
	mud::WidgetState DECL mud_WidgetState_SELECTED() {
		return mud::SELECTED;
	}
	mud::WidgetState DECL mud_WidgetState_DISABLED() {
		return mud::DISABLED;
	}
	mud::WidgetState DECL mud_WidgetState_DRAGGED() {
		return mud::DRAGGED;
	}
	mud::WidgetState DECL mud_WidgetState_FOCUSED() {
		return mud::FOCUSED;
	}
	mud::WidgetState DECL mud_WidgetState_CLOSED() {
		return mud::CLOSED;
	}
	// WindowState
	mud::WindowState DECL mud_WindowState_WINDOW_NOSTATE() {
		return mud::WINDOW_NOSTATE;
	}
	mud::WindowState DECL mud_WindowState_WINDOW_HEADER() {
		return mud::WINDOW_HEADER;
	}
	mud::WindowState DECL mud_WindowState_WINDOW_DOCKABLE() {
		return mud::WINDOW_DOCKABLE;
	}
	mud::WindowState DECL mud_WindowState_WINDOW_CLOSABLE() {
		return mud::WINDOW_CLOSABLE;
	}
	mud::WindowState DECL mud_WindowState_WINDOW_MOVABLE() {
		return mud::WINDOW_MOVABLE;
	}
	mud::WindowState DECL mud_WindowState_WINDOW_SIZABLE() {
		return mud::WINDOW_SIZABLE;
	}
	mud::WindowState DECL mud_WindowState_WINDOW_DEFAULT() {
		return mud::WINDOW_DEFAULT;
	}
	
}

