module Api
  module V1
    class AboutController < ApplicationController
      skip_before_action :verify_authenticity_token
      before_action :set_about, only: [:show, :update]

      # GET /api/v1/about
      def index
        @about = About.first_or_create(
          title: 'Default Title',
          description: 'Default Description',
          content: ''
        )
        
        render json: @about
      end

      # GET /api/v1/about/:id
      def show
        render json: @about
      end

      # POST /api/v1/about
      def create
        @about = About.new(about_params)

        if @about.save
          render json: @about, status: :created
        else
          render json: { errors: @about.errors }, status: :unprocessable_entity
        end
      end

      # PUT/PATCH /api/v1/about/:id
      def update
        if @about.update(about_params)
          render json: @about
        else
          render json: { errors: @about.errors }, status: :unprocessable_entity
        end
      end

      private

      def set_about
        @about = About.find(params[:id])
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'About not found' }, status: :not_found
      end

      def about_params
        params.require(:about).permit(:title, :description, :content)
      end
    end
  end
end
